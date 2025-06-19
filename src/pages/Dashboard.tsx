import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DebtForm } from "@/components/dashboard/DebtForm";
import { DebtsList } from "@/components/dashboard/DebtsList";
import { DollarSign, Users, Clock, RefreshCcw, LogOut, Download, Plus, X, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { DebtStats } from "@/types/debt";

const Dashboard = () => {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const { data: stats, refetch, isFetching } = useQuery({
    queryKey: ['debts-stats'],
    queryFn: async (): Promise<DebtStats> => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('debts')
        .select(`
          amount,
          status,
          payments (
            amount
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.reduce((sum, debt) => sum + debt.amount, 0);
      const totalPaid = data.reduce((sum, debt) => {
        const paidAmount = debt.payments?.reduce((pSum: number, payment: any) => pSum + payment.amount, 0) || 0;
        return sum + paidAmount;
      }, 0);

      const statusCounts = data.reduce((acc, debt) => {
        acc[debt.status] = (acc[debt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total,
        count: data.length,
        average: data.length ? total / data.length : 0,
        paid: totalPaid,
        pending: total - totalPaid,
        overdue: statusCounts.overdue || 0,
      };
    }
  });

  const { data: debts } = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
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
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDownloadExcel = () => {
    if (!debts?.length) {
      toast({
        title: "No Data",
        description: "No debts to export",
        variant: "destructive",
      });
      return;
    }

    const data = debts.map((debt) => {
      const totalPaid = debt.payments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
      return {
        "Customer Name": debt.customer_name,
        "Phone": debt.phone,
        "Total Amount": debt.amount,
        "Amount Paid": totalPaid,
        "Remaining": debt.amount - totalPaid,
        "Status": debt.status,
        "Due Date": debt.due_date || "N/A",
        "Description": debt.description || "",
        "Created At": new Date(debt.created_at).toLocaleString(),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debts");
    XLSX.writeFile(workbook, `Debts_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Download Success",
      description: "Excel file has been downloaded",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/Logo.png" className="h-8 w-auto" alt="Deyn Logo" />
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="hidden sm:flex"
              >
                <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-1">
                Logged in as: <span className="font-medium">{user.email}</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadExcel}
                disabled={!debts?.length}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2"
              >
                {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddForm ? 'Cancel' : 'Add Debt'}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard
              title="Total Owed"
              value={`$${stats?.total.toFixed(2) || "0.00"}`}
              color="bg-blue-50 border-blue-200"
              icon={<DollarSign className="h-5 w-5 text-blue-600" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard
              title="Total Paid"
              value={`$${stats?.paid.toFixed(2) || "0.00"}`}
              color="bg-green-50 border-green-200"
              icon={<TrendingUp className="h-5 w-5 text-green-600" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard
              title="Pending"
              value={`$${stats?.pending.toFixed(2) || "0.00"}`}
              color="bg-yellow-50 border-yellow-200"
              icon={<Clock className="h-5 w-5 text-yellow-600" />}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard
              title="Total Debtors"
              value={stats?.count.toString() || "0"}
              color="bg-purple-50 border-purple-200"
              icon={<Users className="h-5 w-5 text-purple-600" />}
            />
          </motion.div>
        </div>

        {/* Overdue Alert */}
        {stats && stats.overdue > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">
                You have {stats.overdue} overdue debt(s) that need attention.
              </span>
            </div>
          </motion.div>
        )}

        {/* Add Debt Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Debt</h3>
            <DebtForm onSuccess={() => setShowAddForm(false)} />
          </motion.div>
        )}

        {/* Debts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Debt Records</h3>
            <p className="text-gray-600 text-sm mt-1">
              Manage and track all your debt records
            </p>
          </div>
          <div className="p-6">
            <DebtsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;