import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <div className="flex items-center text-sm">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn("h-4 w-4 mr-1", 
                  trend === "up" ? "text-success" : "text-error"
                )} 
              />
              <span className={cn(
                "font-medium",
                trend === "up" ? "text-success" : "text-error"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", colorClasses[color])}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;