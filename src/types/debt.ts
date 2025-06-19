export interface Debt {
  id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  amount: number;
  description?: string;
  due_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  created_at: string;
  updated_at: string;
  total_paid?: number;
  remaining_amount?: number;
}

export interface Payment {
  id: string;
  debt_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money' | 'check' | 'other';
  notes?: string;
  created_at: string;
}

export interface DebtStats {
  total: number;
  count: number;
  average: number;
  paid: number;
  pending: number;
  overdue: number;
}