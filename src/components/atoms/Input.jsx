import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder:text-gray-400";
  
  const variantStyles = error 
    ? "border-error focus:border-error focus:ring-error/20 bg-red-50" 
    : "border-gray-300 focus:border-accent focus:ring-accent/20 bg-white hover:border-gray-400";

  return (
    <input
      type={type}
      className={cn(baseStyles, variantStyles, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;