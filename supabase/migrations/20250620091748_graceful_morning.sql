/*
  # Add debt history tracking

  1. New Tables
    - `debt_history`
      - `id` (uuid, primary key)
      - `debt_id` (uuid, references debts)
      - `action_type` (text) - 'increase', 'payment', 'status_change'
      - `amount` (decimal, optional) - amount for increases/payments
      - `previous_amount` (decimal, optional) - previous debt amount
      - `new_amount` (decimal, optional) - new debt amount
      - `reason` (text, optional) - reason for the action
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `debt_history` table
    - Add policies for authenticated users to view history for their debts

  3. Indexes
    - Add indexes for better query performance
*/

-- Create debt_history table
CREATE TABLE IF NOT EXISTS debt_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid REFERENCES debts(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('increase', 'payment', 'status_change')),
  amount decimal(10,2),
  previous_amount decimal(10,2),
  new_amount decimal(10,2),
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE debt_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view debt history for own debts"
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

CREATE POLICY "Users can insert debt history for own debts"
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_debt_history_debt_id ON debt_history(debt_id);
CREATE INDEX IF NOT EXISTS idx_debt_history_action_type ON debt_history(action_type);
CREATE INDEX IF NOT EXISTS idx_debt_history_created_at ON debt_history(created_at);