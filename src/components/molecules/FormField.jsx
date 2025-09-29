import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  required = false, 
  className,
  type = "input",
  options = [],
  ...props 
}) => {
  const fieldId = props.id || props.name;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {type === "select" ? (
        <Select error={error} {...props}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          className={cn(
            "w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder:text-gray-400 min-h-[80px]",
            error 
              ? "border-error focus:border-error focus:ring-error/20 bg-red-50" 
              : "border-gray-300 focus:border-accent focus:ring-accent/20 bg-white hover:border-gray-400"
          )}
          {...props}
        />
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;