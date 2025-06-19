import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

export const StatCard = ({ color, title, value, icon }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`${color} border-2 hover:shadow-md transition-all duration-200`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};