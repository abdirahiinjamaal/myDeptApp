import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Debts Effortlessly
            </h1>
            <p className="text-xl mb-8">
              Manage your receivables with ease. Track payments, monitor balances,
              and get insights into your finances.
            </p>
            <div className="space-x-4">
              <Button asChild variant="secondary">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Track Everything</h3>
            <p className="text-gray-600">
              Monitor all your receivables in one place
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Get instant insights into your finances
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is always safe and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;