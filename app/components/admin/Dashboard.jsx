import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import Header from './Header';
import StatsCard from './StatsCard';
import { projectAPI, enquiryAPI, quoteAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalEnquiries: 0,
    totalQuotes: 0,
    newEnquiries: 0
  });
  const [loading, setLoading] = useState(true);
  const [newQuotesCount, setNewQuotesCount] = useState(0);
  const [newEnquiriesCount, setNewEnquiriesCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projectsRes, enquiriesRes, quotesRes, enquiriesStatsRes] = await Promise.all([
        projectAPI.getAll(),
        enquiryAPI.getAll(),
        quoteAPI.getAll(),
        enquiryAPI.getStats()
      ]);

      console.log('Projects Response:', projectsRes);
      console.log('Enquiries Response:', enquiriesRes);
      console.log('Quotes Response:', quotesRes);
      console.log('Enquiries Stats Response:', enquiriesStatsRes);

      // Safe data access with multiple fallbacks
      const projectsData = 
        projectsRes?.data?.data?.projects || 
        projectsRes?.data?.projects || 
        projectsRes?.data || 
        [];
      
      const enquiriesData = 
        enquiriesRes?.data?.data?.enquiries || 
        enquiriesRes?.data?.enquiries || 
        enquiriesRes?.data || 
        [];
      
      const quotesData = 
        quotesRes?.data?.data?.quotes || 
        quotesRes?.data?.quotes || 
        quotesRes?.data || 
        [];
      
      const statsData = 
        enquiriesStatsRes?.data?.data || 
        enquiriesStatsRes?.data || 
        {};

      const totalProjects = Array.isArray(projectsData) ? projectsData.length : 0;
      const totalEnquiries = Array.isArray(enquiriesData) ? enquiriesData.length : 0;
      const totalQuotes = Array.isArray(quotesData) ? quotesData.length : 0;
      const newEnquiries = statsData?.newEnquiries || 
                         enquiriesData.filter(e => e.status === 'new').length || 
                         0;

      console.log('Calculated Stats:', {
        totalProjects,
        totalEnquiries,
        totalQuotes,
        newEnquiries
      });

      setStats({
        totalProjects,
        totalEnquiries,
        totalQuotes,
        newEnquiries
      });

      // Set counts for notifications
      setNewQuotesCount(totalQuotes);
      setNewEnquiriesCount(newEnquiries);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalProjects: 0,
        totalEnquiries: 0,
        totalQuotes: 0,
        newEnquiries: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      change: '12',
      icon: Folder,
      color: 'blue'
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      change: '8',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: '15',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      change: stats.newEnquiries > 0 ? '2' : '0',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#001C73] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header 
        title="Dashboard" 
        subtitle="Welcome to RBS Construction Admin Portal"
        newQuotesCount={newQuotesCount}
        newEnquiriesCount={newEnquiriesCount}
      />
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stats.newEnquiries > 0 && (
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#001C73] rounded-full flex items-center justify-center">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stats.newEnquiries} new enquiry(s) received</p>
                    <p className="text-gray-500 text-sm">Today</p>
                  </div>
                </div>
              )}
              {stats.totalQuotes > 0 && (
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#001C73] rounded-full flex items-center justify-center">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stats.totalQuotes} quote request(s) pending</p>
                    <p className="text-gray-500 text-sm">Need attention</p>
                  </div>
                </div>
              )}
              {stats.totalProjects > 0 && (
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-[#001C73] rounded-full flex items-center justify-center">
                    <Folder size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{stats.totalProjects} active project(s)</p>
                    <p className="text-gray-500 text-sm">In progress</p>
                  </div>
                </div>
              )}
              {stats.totalProjects === 0 && stats.totalEnquiries === 0 && stats.totalQuotes === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add Project', icon: Folder, color: 'bg-[#001C73]' },
                { label: 'View Enquiries', icon: MessageSquare, color: 'bg-[#001C73]' },
                { label: 'Check Quotes', icon: FileText, color: 'bg-[#001C73]' },
                { label: 'Analytics', icon: TrendingUp, color: 'bg-[#001C73]' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <action.icon size={24} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;