import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  variant = "primary",
  size = "md",
  children,
  className,
  icon,
  iconPosition = "left",
  loading = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 focus:ring-primary hover:-translate-y-0.5 hover:shadow-lg",
    secondary: "bg-white text-primary border border-primary hover:bg-primary hover:text-white focus:ring-primary hover:-translate-y-0.5 hover:shadow-lg",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-700 focus:ring-error hover:-translate-y-0.5 hover:shadow-lg",
    success: "bg-success text-white hover:bg-green-700 focus:ring-success hover:-translate-y-0.5 hover:shadow-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={cn("animate-spin", iconSizes[size], children && "mr-2")} 
        />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          className={cn(iconSizes[size], children && "mr-2")} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          className={cn(iconSizes[size], children && "ml-2")} 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;