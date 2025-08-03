/*
  # Create sample data for testing (optional)
  
  This migration creates some sample data to test the system.
  You can skip this if you don't want sample data.
*/

-- Note: This is commented out by default
-- Uncomment the following lines if you want to create sample data

/*
-- Insert sample debt (replace 'your-user-id' with actual user ID)
INSERT INTO debts (user_id, customer_name, phone, amount, description, status, due_date) VALUES
  ('your-user-id', 'John Doe', '+1234567890', 1500.00, 'Business loan', 'pending', '2024-12-31'),
  ('your-user-id', 'Jane Smith', '+1234567891', 750.50, 'Personal loan', 'partial', '2024-11-15'),
  ('your-user-id', 'Bob Johnson', '+1234567892', 2000.00, 'Equipment purchase', 'paid', '2024-10-01');

-- Insert sample payments
INSERT INTO payments (debt_id, amount, payment_date, payment_method, notes) VALUES
  ((SELECT id FROM debts WHERE customer_name = 'Jane Smith' LIMIT 1), 250.50, '2024-01-15', 'bank_transfer', 'Partial payment'),
  ((SELECT id FROM debts WHERE customer_name = 'Bob Johnson' LIMIT 1), 2000.00, '2024-09-15', 'cash', 'Full payment');
*/