import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Debt } from "@/types/debt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, DollarSign, Phone, Calendar, FileText, Plus, History } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DebtEditForm } from "./DebtEditForm";
import { PaymentForm } from "./PaymentForm";
import { PaymentHistory } from "./PaymentHistory";
import { DebtIncreaseForm } from "./DebtIncreaseForm";
import { DebtHistory } from "./DebtHistory";

export const DebtsList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});

  const {
    data: debts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("debts")
        .select(`
          *,
          payments (
            amount
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Calculate total paid and remaining amount for each debt
      return data.map((debt: any) => {
        const totalPaid = debt.payments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
        return {
          ...debt,
          total_paid: totalPaid,
          remaining_amount: Math.max(0, debt.amount - totalPaid), // Ensure non-negative
        };
      }) as Debt[];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debt record?")) return;

    try {
      const { error } = await supabase.from("debts").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Debt record deleted",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const closeDialog = (debtId: string, dialogType: string) => {
    setOpenDialogs(prev => ({
      ...prev,
      [`${debtId}-${dialogType}`]: false
    }));
    // Refetch data when dialog closes to ensure UI is updated
    refetch();
  };

  const openDialog = (debtId: string, dialogType: string) => {
    setOpenDialogs(prev => ({
      ...prev,
      [`${debtId}-${dialogType}`]: true
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDebts = debts
    ?.filter((debt) => {
      const matchesSearch = debt.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           debt.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || debt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'name': return a.customer_name.localeCompare(b.customer_name);
        case 'amount-high': return b.amount - a.amount;
        case 'amount-low': return a.amount - b.amount;
        case 'due-date': 
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default: return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!debts?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No debts recorded yet. Add your first debt using the form above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or phone..."
          className="flex-1"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="amount-high">Amount High-Low</option>
          <option value="amount-low">Amount Low-High</option>
          <option value="due-date">Due Date</option>
        </select>
      </div>

      {/* Debts List */}
      <div className="grid gap-4">
        {filteredDebts?.map((debt) => (
          <div key={debt.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{debt.customer_name}</h3>
                  <Badge className={getStatusColor(debt.status)}>
                    {debt.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {debt.phone}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Total: ${debt.amount.toFixed(2)}</span>
                  </div>
                  
                  {debt.total_paid > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Paid: ${debt.total_paid.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {debt.remaining_amount > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Remaining: ${debt.remaining_amount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {debt.due_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {format(new Date(debt.due_date), 'MMM dd, yyyy')}
                    </div>
                  )}
                  
                  {debt.description && (
                    <div className="sm:col-span-2 text-gray-500 text-xs">
                      {debt.description}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {debt.remaining_amount > 0 && (
                  <Dialog 
                    open={openDialogs[`${debt.id}-payment`] || false}
                    onOpenChange={(open) => {
                      if (open) {
                        openDialog(debt.id, 'payment');
                      } else {
                        closeDialog(debt.id, 'payment');
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <DollarSign className="w-4 h-4" />
                        Pay
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment for {debt.customer_name}</DialogTitle>
                      </DialogHeader>
                      <PaymentForm 
                        debtId={debt.id} 
                        maxAmount={debt.remaining_amount} 
                        onSuccess={() => closeDialog(debt.id, 'payment')}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                <Dialog 
                  open={openDialogs[`${debt.id}-increase`] || false}
                  onOpenChange={(open) => {
                    if (open) {
                      openDialog(debt.id, 'increase');
                    } else {
                      closeDialog(debt.id, 'increase');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                      Increase
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Increase Debt for {debt.customer_name}</DialogTitle>
                    </DialogHeader>
                    <DebtIncreaseForm 
                      debt={debt} 
                      onSuccess={() => closeDialog(debt.id, 'increase')}
                    />
                  </DialogContent>
                </Dialog>

                <Dialog 
                  open={openDialogs[`${debt.id}-history`] || false}
                  onOpenChange={(open) => {
                    if (open) {
                      openDialog(debt.id, 'history');
                    } else {
                      closeDialog(debt.id, 'history');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4" />
                      History
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Complete History - {debt.customer_name}</DialogTitle>
                    </DialogHeader>
                    <DebtHistory debtId={debt.id} />
                  </DialogContent>
                </Dialog>

                <Dialog 
                  open={openDialogs[`${debt.id}-edit`] || false}
                  onOpenChange={(open) => {
                    if (open) {
                      openDialog(debt.id, 'edit');
                    } else {
                      closeDialog(debt.id, 'edit');
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Debt</DialogTitle>
                    </DialogHeader>
                    <DebtEditForm 
                      debt={debt} 
                      onSuccess={() => closeDialog(debt.id, 'edit')}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(debt.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};