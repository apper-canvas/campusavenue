import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data available",
  description = "There's nothing to show here yet.",
  icon = "Database",
  actionLabel,
  onAction,
  type = "default"
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case "students":
        return {
          title: "No students found",
          description: "Start by adding your first student to the system.",
          icon: "Users",
          actionLabel: "Add Student"
        };
      case "courses":
        return {
          title: "No courses available",
          description: "Create your first course to get started.",
          icon: "BookOpen",
          actionLabel: "Add Course"
        };
      case "faculty":
        return {
          title: "No faculty members",
          description: "Add faculty members to manage courses.",
          icon: "UserCheck",
          actionLabel: "Add Faculty"
        };
      case "schedules":
        return {
          title: "No schedules created",
          description: "Start creating class schedules for your courses.",
          icon: "Calendar",
          actionLabel: "Create Schedule"
        };
      case "grades":
        return {
          title: "No grades recorded",
          description: "Begin entering grades for your students.",
          icon: "Award",
          actionLabel: "Enter Grades"
        };
      default:
        return { title, description, icon, actionLabel };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} size={40} className="text-accent" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 gradient-text">
        {content.title}
      </h3>
      <p className="text-secondary mb-8 max-w-md">
        {content.description}
      </p>
      {(content.actionLabel || actionLabel) && onAction && (
        <Button 
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {content.actionLabel || actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;