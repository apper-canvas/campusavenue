import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-lg shadow-card border border-gray-200 transition-all duration-200 hover:shadow-lg";

  return (
    <div
      className={cn(baseStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;