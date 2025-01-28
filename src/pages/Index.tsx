import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      {/* Navbar */}
      <nav className="border-b  ">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Deyn
          </Link>
          <Button asChild size="lg" className="gap-2 md:hidden text-sm w-32">
            <Link to="/signup">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <div className="hidden md:flex space-x-4 z-40">
            <Button asChild variant="ghost">
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            </Button>
            <Button asChild>
              <Link to="/signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 ">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Manage Your Debts{" "}
                <span className="text-secondary">Smarter🧠</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Take control of your finances with our powerful debt tracking
                platform. Monitor payments, track balances, and get insights
                into your financial health.
              </p>
              <div className="md:hidden  flex space-x-4 z-40">
                <Button asChild variant="ghost">
                  <Link to="/login" className="flex items-center  gap-2">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> Sign Up
                  </Link>
                </Button>
              </div>
              <Button asChild size="lg" className="hidden md:inline-flex gap-2">
                <Link to="/signup">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative bg-gray-700/90 shadow-black shadow-lg   rounded-lg">
              <img
                src="/HomeImage.png"
                alt="Debt Management"
                className="rounded-lg     py-1 px-1"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-accent">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">Deyn</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted partner in debt management
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: cabdiraxiinjamaal@gmail.com
                <br />
                Phone: +252-61-3224086
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} deyn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
