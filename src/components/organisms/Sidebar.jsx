import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "BarChart3" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Faculty", href: "/faculty", icon: "UserCheck" },
    { name: "Schedules", href: "/schedules", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "Award" },
    { name: "Reports", href: "/reports", icon: "FileText" },
  ];

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const MobileToggle = () => (
    <button
      onClick={toggleMobile}
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
    >
      <ApperIcon name={isMobileOpen ? "X" : "Menu"} size={20} className="text-gray-600" />
    </button>
  );

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
          <ApperIcon name="GraduationCap" size={24} className="text-white" />
        </div>
        <div className="ml-3">
          <h1 className="text-xl font-bold gradient-text">Campus Hub</h1>
          <p className="text-xs text-secondary">College Management</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover-lift",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              )}
            >
              <ApperIcon name={item.icon} size={20} className="mr-3" />
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </nav>
      
<div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-full">
                <ApperIcon name="Settings" size={16} className="text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">System Admin</p>
                <p className="text-xs text-secondary">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => {
                const { AuthContext } = window;
                if (AuthContext?.logout) {
                  AuthContext.logout();
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <ApperIcon name="LogOut" size={16} className="text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileToggle />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
            >
              <SidebarContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;