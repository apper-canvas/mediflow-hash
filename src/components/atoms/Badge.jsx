import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ variant = "default", children, className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    scheduled: "status-scheduled",
    "in-progress": "status-in-progress",
    completed: "status-completed",
    cancelled: "status-cancelled"
  };

  return (
    <span
      className={cn(
        "status-badge",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;