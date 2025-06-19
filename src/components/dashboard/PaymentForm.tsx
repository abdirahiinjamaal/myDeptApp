import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  debtId: string;
  maxAmount: number;
}

export const PaymentForm = ({ debtId, maxAmount }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "cash" as const,
    notes: "",
  });
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      
      if (amount > maxAmount) {
        throw new Error(`Amount cannot exceed remaining debt of $${maxAmount.toFixed(2)}`);
      }

      const { error } = await supabase
        .from('payments')
        .insert([
          {
            debt_id: debtId,
            amount,
            payment_date: format(paymentDate, 'yyyy-MM-dd'),
            payment_method: formData.payment_method,
            notes: formData.notes || null,
          }
        ]);

      if (error) throw error;

      // Update debt status if fully paid
      if (amount === maxAmount) {
        await supabase
          .from('debts')
          .update({ status: 'paid' })
          .eq('id', debtId);
      } else if (amount < maxAmount) {
        await supabase
          .from('debts')
          .update({ status: 'partial' })
          .eq('id', debtId);
      }

      toast({
        title: "Success",
        description: `Payment of $${amount.toFixed(2)} recorded successfully`,
      });

      // Reset form
      setFormData({
        amount: "",
        payment_method: "cash",
        notes: "",
      });
      setPaymentDate(new Date());
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['debts-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Amount * (Max: ${maxAmount.toFixed(2)})
          </label>
          <Input
            type="number"
            step="0.01"
            max={maxAmount}
            placeholder="Enter payment amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <Select value={formData.payment_method} onValueChange={(value: any) => setFormData({ ...formData, payment_method: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Payment Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(paymentDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={paymentDate}
              onSelect={(date) => date && setPaymentDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
        <Textarea
          placeholder="Add any notes about this payment"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Recording Payment..." : "Record Payment"}
      </Button>
    </form>
  );
};