import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="hero-gradient text-white py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wide">
              Track Debts Effortlessly
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
              Manage your receivables with ease. Track payments, monitor
              balances, and get insights into your finances all in one place.
            </p>
            <div className="space-x-6">
              <Button
                asChild
                variant="secondary"
                className="transition-transform transform hover:scale-105 duration-300"
              >
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200"
                >
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="transition-transform transform hover:scale-105 duration-300"
              >
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Track Everything</h3>
            <p className="text-gray-600">
              Monitor all your receivables in one place and stay on top of your
              finances.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 9a7 7 0 1114 0 7 7 0 01-14 0zm7 4a1 1 0 01-1-1V7a1 1 0 112 0v5a1 1 0 01-1 1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Receive instant insights into your finances and stay updated on
              payments.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 110-14 7 7 0 010 14z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is encrypted and fully secure, ensuring complete
              privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;