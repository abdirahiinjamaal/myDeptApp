import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_940biss", // Replace with your actual service ID from EmailJS
        "template_nmijnkn", // Replace with your actual template ID from EmailJS
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        "AWDoqFxAa4LiJkoVa" // Replace with your public key from EmailJS
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          toast({
            title: "Message sent!",
            description:
              "Thank you for reaching out. I'll get back to you soon.",
          });
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("FAILED...", error);
          toast({
            title: "Message not sent!",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      );
  };

  return (
    <section className="py-4 px-4  " id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb4"
        >
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h2>
          
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white backdrop-blur-sm p-8 rounded-2xl"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-silver/1 border border-silver/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-silver/30 transition-all"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-silver/10 border border-silver/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-silver/30 transition-all"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              rows={5}
              className="w-full px-4 py-3 bg-silver/10 border border-silver/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-silver/30 transition-all"
            />
          </div>
          <Button
            type="submit"
            className="w-full  text-white py-3 rounded-xl  transition-colors flex items-center justify-center gap-2 group"
          >
            Send Message
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.form>
      </div>
    </section>
  );
};
