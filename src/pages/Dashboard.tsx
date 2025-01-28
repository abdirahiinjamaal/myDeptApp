import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { DebtForm } from "@/components/dashboard/DebtForm";
import { DollarSign, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">DebtTracker</h1>
            <span className="text-gray-600">Welcome, {user.email}</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Total Owed"
            value="$12,345"
            icon={<DollarSign className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Total Collected"
            value="$5,678"
            icon={<Users className="h-4 w-4 text-gray-500" />}
          />
          <StatCard
            title="Pending"
            value="$6,667"
            icon={<Clock className="h-4 w-4 text-gray-500" />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add New Debt</h2>
            <DebtForm />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="text-gray-500 text-center py-8">
              No recent activity
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;