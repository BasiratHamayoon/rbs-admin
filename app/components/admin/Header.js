import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Menu } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';

const Header = ({ title, subtitle, newQuotesCount = 0, newEnquiriesCount = 0 }) => {
  const { toggleSidebar } = useSidebar();
  const totalNotifications = newQuotesCount + newEnquiriesCount;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Burger Menu for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-600 hover:text-[#001C73] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1 text-sm lg:text-base">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Your notification icons remain the same */}
          {newEnquiriesCount > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-[#001C73] transition-colors duration-200"
              title={`${newEnquiriesCount} new enquiries`}
            >
              <Mail size={24} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#001C73] text-white text-xs rounded-full flex items-center justify-center">
                {newEnquiriesCount}
              </span>
            </motion.div>
          )}

          {/* Rest of your notification code... */}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;