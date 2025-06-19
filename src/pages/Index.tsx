import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowRight, LayoutDashboard, CheckCircle, Shield, BarChart3, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Contact } from "@/pages/Contact";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Easy Debt Tracking",
      description: "Add, edit, and manage all your debts in one place with our intuitive interface."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Payment History",
      description: "Track all payments and see detailed history for each debt record."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. Only you can access your debt records."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile Friendly",
      description: "Access your debt management system from any device, anywhere."
    }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/Logo.png" className="h-8 w-auto" alt="Deyn Logo" />
            </Link>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button asChild variant="default" className="gap-2">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" className="hidden sm:flex">
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* WhatsApp Float Button */}
        <Link
          to="https://wa.me/252613224086"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaWhatsapp className="w-6 h-6" />
        </Link>

        {/* Hero Section */}
        <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Manage Your Debts{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      Smarter
                    </span>
                    <span className="text-4xl">🧠</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Take control of your finances with our powerful debt tracking platform. 
                    Monitor payments, track due dates, and never lose track of who owes you money.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    <span className="font-semibold">📍 Note for Somalia users:</span> 
                    Contact us via WhatsApp to get your user account activated. Thanks! ❤️
                  </p>
                </div>

                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                      <Link to="/signup" className="flex items-center gap-2">
                        Get Started Free <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                      <Link to="/login">
                        Sign In
                      </Link>
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
                  <img
                    src="/HomeImage.png"
                    alt="Debt Management Dashboard"
                    className="w-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                </div>
                
                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="absolute -right-4 top-8 bg-white rounded-lg shadow-lg p-4 border"
                >
                  <div className="text-sm text-gray-600">Total Managed</div>
                  <div className="text-2xl font-bold text-green-600">$12,450</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -left-4 bottom-8 bg-white rounded-lg shadow-lg p-4 border"
                >
                  <div className="text-sm text-gray-600">Active Debts</div>
                  <div className="text-2xl font-bold text-blue-600">24</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Built with modern technology to make debt management simple and efficient
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Ready to Take Control?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of users who are already managing their debts smarter
                </p>
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                  <Link to="/signup" className="flex items-center gap-2">
                    Start Free Today <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <div className="bg-gray-50">
          <Contact />
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <img src="/Logo.png" className="h-8 w-auto mb-4" alt="Deyn Logo" />
                <p className="text-gray-400">
                  Your trusted partner in debt management. Simple, secure, and effective.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link to="/login" className="hover:text-white transition-colors">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="hover:text-white transition-colors">
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <div className="text-gray-400 space-y-2">
                  <p>Email: cabdiraxiinjamaal@gmail.com</p>
                  <p>Phone: +252-61-3224086</p>
                  <p>WhatsApp: Available 24/7</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Deyn. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;