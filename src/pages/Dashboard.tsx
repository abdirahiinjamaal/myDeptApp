import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DebtForm } from "@/components/dashboard/DebtForm";
import { DebtsList } from "@/components/dashboard/DebtsList";
import { DollarSign, Users, Clock, RefreshCcw, LucideRefreshCcw, LogOut, Download, } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";


const Dashboard = () => {
  const { toast } = useToast();

  const [open,setOpen] = useState(false)
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();


  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const { data: stats,refetch,isFetching, } = useQuery({
    queryKey: ['debts-stats'],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('debts')
        .select('amount')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data.reduce((sum, debt) => sum + debt.amount, 0);
      return {
        total,
        count: data.length,
        average: data.length ? total / data.length : 0
      };
    }
  });
  const { data: debts } = useQuery({
    queryKey: ["debts"],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("debts")
        .select("*") // Get all fields
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

      const data = debts.map((debt) => ({
        "Customer Name": debt.customer_name,
        Phone: debt.phone,
        Amount: debt.amount,
        "Created At": new Date(debt.created_at).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Debts");
      XLSX.writeFile(workbook, "Debts.xlsx");

      toast({
        title: "Download Success",
        description: "Excel file has been downloaded",
      });
    };

  if (isLoading) {
    return (
      <div role="status" className="items-center justify-center h-screen flex">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">isLoading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-bold">
              <img src="/Logo.png" className="h-6 md:h-12 w-auto" alt="" />
            </Link>
          </div>
          <Button variant="white" onClick={handleLogout}>
            Logout
            <LogOut />
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex  gap-4 justify-between items-center py-2">
          <p className="text-gray-600   mb-5 flex items-center gap-4 font-bold">
            Welcome,{" "}
            <span className="font-bold px-4 bg-slate-900  text-[12px]  text-white/80 py-2 rounded-lg ">
              {user.email}
            </span>
          </p>
          <Button
            className="bg-transparent   hover:bg-transparent text-black"
            onClick={() => refetch()} // Trigger a refresh
            disabled={isFetching} // Disable the button while fetching
          >
            {isFetching ? (
              <RefreshCcw className="animate-spin" />
            ) : (
              <RefreshCcw className="" />
            )}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <StatCard
              title="Total Owed"
              color="bg-green-100"
              value={`$${stats?.total.toFixed(2) || "0.00"}`}
              icon={<DollarSign className="h-4 w-4 text-gray-500" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <StatCard
              title="Total Debtors"
              color="bg-red-100"
              value={stats?.count.toString() || "0"}
              icon={<Users className="h-4 w-4 text-gray-500" />}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <StatCard
              title="Average Debt"
              color="bg-indigo-100"
              value={`$${stats?.average.toFixed(2) || "0.00"}`}
              icon={<Clock className="h-4 w-4 text-gray-500" />}
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {open ? (
            <div className="bg-white p-6  rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Add New Debt</h2>
              <div className="mb-5">
                <DebtForm />
              </div>
              <Button
                className="  w-32"
                variant="red"
                onClick={() => setOpen(!open)}
              >
                Close
              </Button>
            </div>
          ) : (
            <Button className=" w-32" onClick={() => setOpen(!open)}>
              Add
            </Button>
          )}

          <div className="relative bg-black/10 p-6 rounded-lg shadow w-full">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <Button onClick={handleDownloadExcel} className="p-4 absolute right-5 top-5 bg-green-700">
              <Download />
            </Button>
            <DebtsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;