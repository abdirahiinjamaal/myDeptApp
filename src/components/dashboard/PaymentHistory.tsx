import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Payment } from "@/types/debt";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, CreditCard, FileText } from "lucide-react";

interface PaymentHistoryProps {
  debtId: string;
}

export const PaymentHistory = ({ debtId }: PaymentHistoryProps) => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", debtId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("debt_id", debtId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
  });

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'bank_transfer': return 'Bank Transfer';
      case 'mobile_money': return 'Mobile Money';
      case 'check': return 'Check';
      case 'other': return 'Other';
      default: return method;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'bank_transfer': return 'bg-blue-100 text-blue-800';
      case 'mobile_money': return 'bg-purple-100 text-purple-800';
      case 'check': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No payments recorded yet.</p>
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="w-5 h-5" />
          Total Paid: ${totalPaid.toFixed(2)}
        </div>
        <p className="text-sm text-gray-600">{payments.length} payment(s) recorded</p>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="border rounded-lg p-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">${payment.amount.toFixed(2)}</span>
                  <Badge className={getPaymentMethodColor(payment.payment_method)}>
                    {getPaymentMethodLabel(payment.payment_method)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                </div>
                
                {payment.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {payment.notes}
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                Recorded: {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};