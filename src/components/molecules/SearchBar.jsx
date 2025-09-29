import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  value: controlledValue,
  onChange: controlledOnChange 
}) => {
  const [internalValue, setInternalValue] = useState("");
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (isControlled && controlledOnChange) {
      controlledOnChange(e);
    } else {
      setInternalValue(newValue);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className={cn("relative max-w-md", className)}>
      <ApperIcon 
        name="Search" 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-gray-400 bg-white"
      />
    </div>
  );
};

export default SearchBar;