/*
  # Create utility functions and triggers

  1. Functions
    - Function to automatically update debt status based on payments
    - Function to calculate remaining debt amount
    - Function to handle overdue debts

  2. Triggers
    - Trigger to update debt status when payments are added/updated/deleted
    - Trigger to check for overdue debts

  3. Views
    - View for debt statistics
    - View for debt summary with payment information
*/

-- Function to calculate total paid amount for a debt
CREATE OR REPLACE FUNCTION calculate_total_paid(debt_uuid uuid)
RETURNS numeric AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(amount) FROM payments WHERE debt_id = debt_uuid),
    0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update debt status based on payments
CREATE OR REPLACE FUNCTION update_debt_status()
RETURNS TRIGGER AS $$
DECLARE
  debt_amount numeric;
  total_paid numeric;
  new_status text;
BEGIN
  -- Get the debt amount
  SELECT amount INTO debt_amount 
  FROM debts 
  WHERE id = COALESCE(NEW.debt_id, OLD.debt_id);
  
  -- Calculate total paid
  total_paid := calculate_total_paid(COALESCE(NEW.debt_id, OLD.debt_id));
  
  -- Determine new status
  IF total_paid >= debt_amount THEN
    new_status := 'paid';
  ELSIF total_paid > 0 THEN
    new_status := 'partial';
  ELSE
    new_status := 'pending';
  END IF;
  
  -- Update debt status
  UPDATE debts 
  SET status = new_status, updated_at = now()
  WHERE id = COALESCE(NEW.debt_id, OLD.debt_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic status updates
CREATE TRIGGER trigger_update_debt_status_on_payment_insert
  AFTER INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_debt_status();

CREATE TRIGGER trigger_update_debt_status_on_payment_update
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_debt_status();

CREATE TRIGGER trigger_update_debt_status_on_payment_delete
  AFTER DELETE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_debt_status();

-- Function to mark overdue debts
CREATE OR REPLACE FUNCTION mark_overdue_debts()
RETURNS void AS $$
BEGIN
  UPDATE debts 
  SET status = 'overdue', updated_at = now()
  WHERE due_date < CURRENT_DATE 
    AND status IN ('pending', 'partial');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for debt statistics per user
CREATE OR REPLACE VIEW debt_stats AS
SELECT 
  d.user_id,
  COUNT(*) as total_debts,
  SUM(d.amount) as total_amount,
  SUM(COALESCE(p.total_paid, 0)) as total_paid,
  SUM(d.amount - COALESCE(p.total_paid, 0)) as total_remaining,
  COUNT(CASE WHEN d.status = 'paid' THEN 1 END) as paid_count,
  COUNT(CASE WHEN d.status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN d.status = 'partial' THEN 1 END) as partial_count,
  COUNT(CASE WHEN d.status = 'overdue' THEN 1 END) as overdue_count
FROM debts d
LEFT JOIN (
  SELECT 
    debt_id,
    SUM(amount) as total_paid
  FROM payments
  GROUP BY debt_id
) p ON d.id = p.debt_id
GROUP BY d.user_id;

-- Enable RLS on the view
ALTER VIEW debt_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for debt_stats view
CREATE POLICY "Users can view their own debt stats"
  ON debt_stats
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());