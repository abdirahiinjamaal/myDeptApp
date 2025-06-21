import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Debt } from "@/types/debt";

interface DebtIncreaseFormProps {
  debt: Debt;
  onSuccess?: () => void;
}

export const DebtIncreaseForm = ({ debt, onSuccess }: DebtIncreaseFormProps) => {
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const increaseAmount = parseFloat(formData.amount);
      
      if (increaseAmount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const newTotalAmount = debt.amount + increaseAmount;

      // Update the debt amount
      const { error: debtError } = await supabase
        .from("debts")
        .update({
          amount: newTotalAmount,
          status: debt.status === 'paid' ? 'partial' : debt.status,
        })
        .eq("id", debt.id);

      if (debtError) throw debtError;

      // Record the debt increase in debt_history table
      const { error: historyError } = await supabase
        .from("debt_history")
        .insert([
          {
            debt_id: debt.id,
            action_type: "increase",
            amount: increaseAmount,
            previous_amount: debt.amount,
            new_amount: newTotalAmount,
            reason: formData.reason || null,
          }
        ]);

      if (historyError) throw historyError;

      toast({
        title: "Success",
        description: `Debt increased by $${increaseAmount.toFixed(2)}`,
      });

      // Reset form
      setFormData({
        amount: "",
        reason: "",
      });
      
      // Invalidate and refetch all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['debts'] }),
        queryClient.invalidateQueries({ queryKey: ['debts-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['debt-history'] }),
      ]);

      // Force refetch to ensure UI updates
      await queryClient.refetchQueries({ queryKey: ['debts'] });
      
      onSuccess?.();
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
      <div>
        <label className="block text-sm font-medium mb-1">
          Current Debt Amount: ${debt.amount.toFixed(2)}
        </label>
        <label className="block text-sm font-medium mb-1">
          Additional Amount *
        </label>
        <Input
          type="number"
          step="0.01"
          placeholder="Enter additional amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
        <Textarea
          placeholder="Why is this debt being increased?"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows={3}
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>New Total:</strong> ${formData.amount ? (debt.amount + parseFloat(formData.amount || "0")).toFixed(2) : debt.amount.toFixed(2)}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Increasing Debt..." : "Increase Debt"}
      </Button>
    </form>
  );
};