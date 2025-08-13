import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, action, icon = "Inbox" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-card">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name={action.icon || "Plus"} className="h-4 w-4" />
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;