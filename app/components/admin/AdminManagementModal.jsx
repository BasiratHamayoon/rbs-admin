import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import { adminAPI } from '../../services/api';

const AdminManagementModal = ({ isOpen, onClose, currentAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Reset messages and form data when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetMessages();
      // Reset password fields when modal opens
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [isOpen, currentAdmin]);

  const resetMessages = () => {
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      await adminAPI.changePassword(passwordData);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      // Close modal after successful password change (with slight delay to show success message)
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-white/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Admin Profile */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#001C73] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-white text-lg">
                  {currentAdmin?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {currentAdmin?.username || 'Admin'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {currentAdmin?.email || 'admin@rbsconstruction.com'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Header */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-[#001C73] border-b-2 border-[#001C73] bg-white">
              <Lock size={16} />
              Change Password
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto bg-white">
            {/* Message Display */}
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
                {message.type === 'success' && (
                  <div className="text-xs text-green-600 mt-1">
                    Closing automatically...
                  </div>
                )}
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-600 pr-10"
                    required
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      current: !prev.current
                    }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-600 pr-10"
                    required
                    minLength={8}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      new: !prev.new
                    }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-600 pr-10"
                    required
                    minLength={8}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      confirm: !prev.confirm
                    }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-[#001C73] hover:bg-[#001255] text-white"
                >
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminManagementModal;