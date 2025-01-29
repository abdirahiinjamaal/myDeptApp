
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowRight, LayoutDashboard, LucideLayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Contact } from "@/pages/Contact";
import { FaDashcube, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    fetchSession();

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    // Clean up the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <>
      <div className="min-h-screen  flex flex-col">
        {/* Navbar */}

        <nav className="border-b  ">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold ">
              <img src="/Logo.png" className="h-6 md:h-6 w-auto" alt="" />
            </Link>
            {isAuthenticated ? (
              <Button
                variant="white"
                className=" gap-2 md:hidden text-sm w-32  "
              >
                <Link to="/dashboard">Dashbaord</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="gap-2 md:hidden text-sm w-32"
              >
                <Link to="/login">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                variant="white"
                className="gap-2 hidden md:flex text-sm w-32"
              >
                <Link to="/dashboard">
                  Dashbaord
                  <LucideLayoutDashboard />
                </Link>
              </Button>
            ) : (
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
            )}
          </div>
        </nav>
        <div className=" items-center gap-3 fixed inline-flex  z-40 right-10 bottom-10 ">
          {" "}
          <Link
            to={"/"}
            className="bg-green-600 animate-bounce  inline-flex items-center justify-center p-2 text-white font-bold text-2xl rounded-xl"
          >
            {" "}
            <FaWhatsapp />
          </Link>
        </div>
        {/* Hero Section */}
        <section className="flex-1">
          <div className="container mx-auto px-4 md:12 py-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* ✅ Text Section (Left) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="md:w-1/2 space-y-6 text-center md:text-left"
              >
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Manage Your Debts{" "}
                  <span className="text-secondary">Smarter🧠</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Take control of your finances with our powerful debt tracking
                  platform.
                </p>
                <p className="text-lg text-gray-600 font-bold">
                  <span className="text-red-500 font-semibold text-xl">
                    Note:
                  </span>
                  Hada somalia joogto ama meel kale WhatsApp Nagala Sooxirir Si
                  Aad{" "}
                  <span className="text-green-600 font-bold text-2xl">
                    ''User''
                  </span>{" "}
                  uhesho, thanks❤️
                </p>

                {!isAuthenticated && (
                  <Button asChild size="lg" className="gap-2 text-sm w-32">
                    <Link to="/login">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </motion.div>

              {/* ✅ Image Section (Right) */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="md:w-1/2 rounded-3xl overflow-hidden shadow-black p-2 shadow-lg"
              >
                <img
                  src="/HomeImage.png"
                  alt="Debt Management"
                  className="rounded-lg md:grayscale md:hover:grayscale-0 py-1 px-1 w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="bg-gray-200">
          <Contact />
        </div>
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
        <Analytics />
      </div>
    </>
  );
};

export default Index;
