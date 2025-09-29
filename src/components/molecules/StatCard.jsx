import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  gradient = false 
}) => {
  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-500";
  };

  const getTrendIcon = () => {
    if (!trend) return "Minus";
    return trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-lg p-6 border border-gray-200 shadow-card hover:shadow-lg transition-all duration-200",
        gradient && "bg-gradient-to-br from-white to-surface",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-secondary text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 gradient-text">{value}</p>
          {trendValue && (
            <div className="flex items-center space-x-1">
              <ApperIcon name={getTrendIcon()} size={16} className={getTrendColor()} />
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-3 rounded-lg">
          <ApperIcon name={icon} size={24} className="text-primary" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;