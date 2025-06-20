import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, TrendingUp, TrendingDown, FileText, Plus } from "lucide-react";

interface DebtHistoryProps {
  debtId: string;
}

interface DebtHistoryItem {
  id: string;
  debt_id: string;
  action_type: 'increase' | 'payment' | 'status_change';
  amount?: number;
  previous_amount?: number;
  new_amount?: number;
  reason?: string;
  created_at: string;
}

export const DebtHistory = ({ debtId }: DebtHistoryProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ["debt-history", debtId],
    queryFn: async () => {
      // Get debt history
      const { data: debtHistory, error: historyError } = await supabase
        .from("debt_history")
        .select("*")
        .eq("debt_id", debtId)
        .order("created_at", { ascending: false });

      if (historyError) throw historyError;

      // Get payments history
      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("debt_id", debtId)
        .order("payment_date", { ascending: false });

      if (paymentsError) throw paymentsError;

      // Combine and sort all history items
      const combinedHistory = [
        ...debtHistory.map(item => ({
          ...item,
          type: 'debt_action',
          date: item.created_at
        })),
        ...payments.map(payment => ({
          id: payment.id,
          debt_id: payment.debt_id,
          action_type: 'payment' as const,
          amount: payment.amount,
          payment_method: payment.payment_method,
          notes: payment.notes,
          created_at: payment.created_at,
          payment_date: payment.payment_date,
          type: 'payment',
          date: payment.payment_date
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return combinedHistory;
    },
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'status_change':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'increase':
        return 'bg-red-100 text-red-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'status_change':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionLabel = (item: any) => {
    switch (item.action_type) {
      case 'increase':
        return 'Debt Increased';
      case 'payment':
        return `Payment (${item.payment_method?.replace('_', ' ').toUpperCase()})`;
      case 'status_change':
        return 'Status Changed';
      default:
        return 'Unknown Action';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!history?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No history recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5" />
          Complete History ({history.length} entries)
        </div>
        <p className="text-sm text-gray-600">All actions and payments for this debt</p>
      </div>

      <div className="space-y-3">
        {history.map((item: any) => (
          <div key={`${item.type}-${item.id}`} className="border rounded-lg p-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getActionIcon(item.action_type)}
                  <span className="font-semibold">{getActionLabel(item)}</span>
                  <Badge className={getActionColor(item.action_type)}>
                    {item.action_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                {item.amount && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">
                      {item.action_type === 'increase' ? '+' : '-'}${item.amount.toFixed(2)}
                    </span>
                    {item.action_type === 'increase' && item.previous_amount && (
                      <span className="text-gray-500">
                        (${item.previous_amount.toFixed(2)} → ${item.new_amount.toFixed(2)})
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {item.action_type === 'payment' && item.payment_date 
                    ? format(new Date(item.payment_date), 'MMM dd, yyyy')
                    : format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')
                  }
                </div>
                
                {(item.reason || item.notes) && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {item.reason || item.notes}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                {item.action_type === 'payment' ? 'Payment Date' : 'Recorded'}: {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};