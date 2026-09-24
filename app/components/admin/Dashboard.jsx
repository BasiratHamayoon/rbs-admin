"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, MessageSquare, FileText, TrendingUp, Activity, Zap, Calendar } from 'lucide-react';
import Header from './Header';
import StatsCard from './StatsCard';
import { projectAPI, enquiryAPI, quoteAPI } from '../../services/api';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
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

      setStats({
        totalProjects,
        totalEnquiries,
        totalQuotes,
        newEnquiries
      });

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
      change: 12,
      icon: Folder,
      color: 'blue'
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      change: 8,
      icon: MessageSquare,
      color: 'purple'
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: 15,
      icon: FileText,
      color: 'yellow'
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      change: stats.newEnquiries > 0 ? 2 : 0,
      icon: TrendingUp,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-[#001C73] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-white">
      <Header
        title="Dashboard"
        subtitle="Welcome to RBS Construction Admin Portal"
        newQuotesCount={newQuotesCount}
        newEnquiriesCount={newEnquiriesCount}
      />

      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#001C73]">Welcome Back!</h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Calendar size={16} className="text-[#001C73]" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-[#001C73]/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-[#001C73]">System Online</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#001C73] rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <p className="text-xs text-gray-500">Latest system updates</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#001C73] bg-blue-50 px-3 py-1 rounded-full">
                Live
              </span>
            </div>

            <div className="space-y-3">
              {stats.newEnquiries > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-[#001C73]/10 hover:border-[#001C73]/30 transition-all"
                >
                  <div className="w-11 h-11 bg-[#001C73] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {stats.newEnquiries} new enquiry{stats.newEnquiries > 1 ? 's' : ''} received
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">Today • Needs attention</p>
                  </div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </motion.div>
              )}
              {stats.totalQuotes > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-[#001C73]/10 hover:border-[#001C73]/30 transition-all"
                >
                  <div className="w-11 h-11 bg-[#001C73] rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {stats.totalQuotes} quote request{stats.totalQuotes > 1 ? 's' : ''} pending
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">Review required</p>
                  </div>
                </motion.div>
              )}
              {stats.totalProjects > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-[#001C73]/10 hover:border-[#001C73]/30 transition-all"
                >
                  <div className="w-11 h-11 bg-[#001C73] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Folder size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {stats.totalProjects} active project{stats.totalProjects > 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">In progress</p>
                  </div>
                </motion.div>
              )}
              {stats.totalProjects === 0 &&
                stats.totalEnquiries === 0 &&
                stats.totalQuotes === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity size={28} className="text-[#001C73]" />
                    </div>
                    <p className="text-gray-600 font-semibold">No recent activity</p>
                    <p className="text-gray-400 text-sm mt-1">Activity will appear here</p>
                  </div>
                )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#001C73] rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                  <p className="text-xs text-gray-500">Frequently used tools</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add Project', icon: Folder, path: '/admin/projects' },
                { label: 'View Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
                { label: 'Check Quotes', icon: FileText, path: '/admin/quotes' },
                { label: 'Analytics', icon: TrendingUp, path: '/admin' }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={() => router.push(action.path)}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="p-5 bg-blue-50 rounded-xl text-center hover:bg-[#001C73] hover:shadow-lg transition-all duration-300 group border border-[#001C73]/10"
                >
                  <div className="w-12 h-12 bg-[#001C73] rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors duration-300">
                    <action.icon size={22} className="text-white group-hover:text-[#001C73] transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm group-hover:text-white transition-colors duration-300">
                    {action.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
              <p className="text-xs text-gray-500 mt-1">Your business at a glance</p>
            </div>
            <span className="text-xs font-semibold text-[#001C73] bg-blue-50 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-[#001C73]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Completion Rate</span>
                <span className="text-xs font-bold text-green-600">+12%</span>
              </div>
              <p className="text-2xl font-bold text-[#001C73]">94%</p>
              <div className="mt-2 w-full h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#001C73] rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-[#001C73]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Response Time</span>
                <span className="text-xs font-bold text-green-600">Fast</span>
              </div>
              <p className="text-2xl font-bold text-[#001C73]">2.4h</p>
              <div className="mt-2 w-full h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#001C73] rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-[#001C73]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Client Satisfaction</span>
                <span className="text-xs font-bold text-green-600">Excellent</span>
              </div>
              <p className="text-2xl font-bold text-[#001C73]">98%</p>
              <div className="mt-2 w-full h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#001C73] rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;