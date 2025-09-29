import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white";
  
  const variantStyles = error 
    ? "border-error focus:border-error focus:ring-error/20 bg-red-50" 
    : "border-gray-300 focus:border-accent focus:ring-accent/20 hover:border-gray-400";

  return (
    <select
      className={cn(baseStyles, variantStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;