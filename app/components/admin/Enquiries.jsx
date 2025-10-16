import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import Header from './Header';
import Button from '../ui/Button';
import { enquiryAPI } from '../../services/api';
import { STATUS_OPTIONS } from '../../utils/constants';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await enquiryAPI.getAll();
      console.log('Enquiries API response:', response); // Debug log
      
      // Handle different possible response structures
      const enquiriesData = 
        response?.data?.data?.enquiries || 
        response?.data?.enquiries || 
        response?.data || 
        [];
      
      console.log('Processed enquiries data:', enquiriesData);
      setEnquiries(Array.isArray(enquiriesData) ? enquiriesData : []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await enquiryAPI.update(id, { status });
      setEnquiries(enquiries.map(enquiry => 
        enquiry._id === id ? { ...enquiry, status } : enquiry
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await enquiryAPI.delete(id);
        setEnquiries(enquiries.filter(enquiry => enquiry._id !== id));
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#001C73] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safe check before rendering
  const safeEnquiries = Array.isArray(enquiries) ? enquiries : [];

  return (
    <div className="flex-1">
      <Header 
        title="Enquiries" 
        subtitle="Manage customer enquiries"
        newEnquiriesCount={safeEnquiries.filter(e => e.status === 'new').length}
      />
      
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enquiry Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {safeEnquiries.map((enquiry, index) => (
                  <motion.tr
                    key={enquiry._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{enquiry.name || 'No Name'}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail size={14} />
                          {enquiry.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone size={14} />
                          {enquiry.phoneCountryCode} {enquiry.telephone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {enquiry.enquiryType || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {enquiry.message || 'No message provided'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={enquiry.status || 'new'}
                        onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                        className={`px-3 py-1 text-white text-sm rounded-full border-none outline-none ${getStatusColor(enquiry.status)}`}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="bg-[#001C73] hover:bg-[#001C73] hover:opacity-80 bg-blue-900 text-white border-none"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {safeEnquiries.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Mail size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Enquiries Yet
              </h3>
              <p className="text-gray-600">
                Customer enquiries will appear here when they contact you.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enquiries;