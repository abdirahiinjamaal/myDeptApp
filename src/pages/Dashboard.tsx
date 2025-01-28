import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DebtForm } from "@/components/dashboard/DebtForm";
import { DebtsList } from "@/components/dashboard/DebtsList";
import { DollarSign, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const [open,setOpen] = useState(false)
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const { data: stats } = useQuery({
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
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
        <span className="sr-only">Loading...</span>
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
            <h1 className="text-xl font-bold">Deyn</h1>
            <span className="text-gray-600 hidden md:inline-flex">
              Welcome, <span className="font-bold underline">{user.email}</span>
            </span>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <span className="text-gray-600 inline-flex mb-5">
          Welcome, <span className="font-bold underline">{user.email}</span>
        </span>
        <div className="grid gap-4 md:grid-cols-3 grid-cols-2 mb-8">
          <StatCard
            title="Total Owed"
            color="bg-green-100"
            value={`$${stats?.total.toFixed(2) || "0.00"}`}
            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Total Debtors"
            color="bg-red-100"
            value={stats?.count.toString() || "0"}
            icon={<Users className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Average Debt"
            color="bg-indigo-100"
            value={`$${stats?.average.toFixed(2) || "0.00"}`}
            icon={<Clock className="h-4 w-4 text-gray-500" />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {open ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Add New Debt</h2>
              <div className="">
                <DebtForm />
               
              </div>
               
            </div>
          ) : (
            <Button className="w-32" onClick={() => setOpen(!open)}>
              Add Dept
            </Button>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <DebtsList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;