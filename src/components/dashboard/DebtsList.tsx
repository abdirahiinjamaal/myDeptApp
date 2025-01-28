import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Debt } from "@/types/debt";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export const DebtsList = () => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const { data: debts, isLoading } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Debt[];
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Debt record deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (debt: Debt) => {
    setEditingId(debt.id);
    setEditName(debt.customer_name);
    setEditPhone(debt.phone);
    setEditAmount(debt.amount.toString());
  };

  const handleUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .update({
          customer_name: editName,
          phone: editPhone,
          amount: parseFloat(editAmount)
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      toast({
        title: "Success",
        description: "Debt record updated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!debts?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No debts recorded yet. Add your first debt using the form above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <div key={debt.id} className="bg-white p-4 rounded-lg shadow">
          {editingId === debt.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdate(debt.id)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{debt.customer_name}</h3>
                <p className="text-sm text-gray-600">{debt.phone}</p>
                <p className="text-lg font-bold">${debt.amount}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(debt)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(debt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};