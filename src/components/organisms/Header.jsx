import React from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, searchValue, onSearchChange }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="hidden sm:block w-96">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search patients, appointments..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-gray-900 hidden sm:block">Dr. Smith</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;