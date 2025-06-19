/*
  # Create debts management system

  1. New Tables
    - `debts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_name` (text)
      - `phone` (text)
      - `amount` (decimal)
      - `description` (text, optional)
      - `due_date` (date, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `debts` table
    - Add policies for authenticated users to manage their own debts

  3. Indexes
    - Add indexes for better query performance
*/

-- Create debts table
CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount > 0),
  description text,
  due_date date,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own debts"
  ON debts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debts"
  ON debts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debts"
  ON debts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own debts"
  ON debts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_debts_due_date ON debts(due_date);
CREATE INDEX IF NOT EXISTS idx_debts_created_at ON debts(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();