/*
  # Create debt_history table for tracking debt changes

  1. New Tables
    - `debt_history`
      - `id` (uuid, primary key)
      - `debt_id` (uuid, foreign key to debts)
      - `action_type` (text, enum-like with check constraint)
      - `amount` (numeric, optional - for increase/payment amounts)
      - `previous_amount` (numeric, optional - for tracking changes)
      - `new_amount` (numeric, optional - for tracking changes)
      - `reason` (text, optional - reason for the change)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `debt_history` table
    - Add policies for authenticated users to view history for their debts

  3. Indexes
    - Index on debt_id for faster queries
    - Index on created_at for sorting
*/

-- Create debt_history table
CREATE TABLE IF NOT EXISTS debt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('increase', 'payment', 'status_change')),
  amount numeric(10,2),
  previous_amount numeric(10,2),
  new_amount numeric(10,2),
  reason text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE debt_history ENABLE ROW LEVEL SECURITY;

-- Create policies for debt_history table
CREATE POLICY "Users can view history for their debts"
  ON debt_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = debt_history.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert history for their debts"
  ON debt_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debts 
      WHERE debts.id = debt_history.debt_id 
      AND debts.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_debt_history_debt_id ON debt_history(debt_id);
CREATE INDEX IF NOT EXISTS idx_debt_history_created_at ON debt_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debt_history_action_type ON debt_history(action_type);