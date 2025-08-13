import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Patients", href: "/patients", icon: "Users" },
    { name: "Appointments", href: "/appointments", icon: "Calendar" },
    { name: "Doctors", href: "/doctors", icon: "UserCheck" }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        location.pathname === item.href || (item.href === "/dashboard" && location.pathname === "/")
          ? "bg-primary text-white shadow-lg"
          : "text-gray-700 hover:bg-primary/10 hover:text-primary"
      )}
    >
      <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
      {item.name}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Heart" className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MediFlow</h1>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative w-60 bg-white shadow-elevated transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Heart" className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">MediFlow</h1>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;