import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded hover-lift";
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-md",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20 focus:ring-secondary/50",
    accent: "bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg focus:ring-accent/50",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50 shadow-sm hover:shadow-md",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm hover:shadow-md",
    warning: "bg-warning text-white hover:bg-warning/90 focus:ring-warning/50 shadow-sm hover:shadow-md",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;