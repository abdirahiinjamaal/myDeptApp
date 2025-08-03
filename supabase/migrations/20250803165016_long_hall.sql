/*
  # Create payments table for tracking debt payments

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `debt_id` (uuid, foreign key to debts)
      - `amount` (numeric, required)
      - `payment_date` (date, required)
      - `payment_method` (text, enum-like with check constraint)
      - `notes` (text, optional)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `payments` table
    - Add policies for authenticated users to manage payments for their debts

  3. Indexes
    - Index on debt_id for faster queries
    - Index on payment_date for sorting
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'mobile_money', 'check', 'other')),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view payments for their debts"
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

CREATE POLICY "Users can insert payments for their debts"
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

CREATE POLICY "Users can update payments for their debts"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = payments.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for their debts"
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);