/*
  # Setup authentication and user management

  1. Auth Configuration
    - Ensure proper auth settings
    - Create user profile triggers if needed

  2. Security Policies
    - Ensure all tables have proper RLS policies
    - Add any missing security configurations

  3. Functions
    - Helper functions for user management
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- You can add any additional user setup logic here
  -- For example, creating a user profile, setting default preferences, etc.
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup (optional)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure auth.users table exists and is accessible
-- (This is usually handled by Supabase automatically)

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure RLS is enabled on all our tables
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_history ENABLE ROW LEVEL SECURITY;

-- Create a function to get user's debt summary
CREATE OR REPLACE FUNCTION get_user_debt_summary(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE (
  total_debts bigint,
  total_amount numeric,
  total_paid numeric,
  total_remaining numeric,
  overdue_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(d.id) as total_debts,
    COALESCE(SUM(d.amount), 0) as total_amount,
    COALESCE(SUM(p.total_paid), 0) as total_paid,
    COALESCE(SUM(d.amount - COALESCE(p.total_paid, 0)), 0) as total_remaining,
    COUNT(CASE WHEN d.status = 'overdue' THEN 1 END) as overdue_count
  FROM debts d
  LEFT JOIN (
    SELECT 
      debt_id,
      SUM(amount) as total_paid
    FROM payments
    GROUP BY debt_id
  ) p ON d.id = p.debt_id
  WHERE d.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;