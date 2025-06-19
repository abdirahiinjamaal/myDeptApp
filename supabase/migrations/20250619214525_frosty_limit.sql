/*
  # Create payments tracking system

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `debt_id` (uuid, references debts)
      - `amount` (decimal)
      - `payment_date` (date)
      - `payment_method` (text)
      - `notes` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `payments` table
    - Add policies for authenticated users to manage payments for their debts
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  payment_date date DEFAULT CURRENT_DATE,
  payment_method text DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'check', 'other')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view payments for own debts"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments for own debts"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments for own debts"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for own debts"
  ON payments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);