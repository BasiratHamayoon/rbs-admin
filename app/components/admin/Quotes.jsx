import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail, Phone, Calendar } from 'lucide-react';
import Header from './Header';
import { quoteAPI } from '../../services/api';
import LoadingSpinner from './LoadingSpinner';

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await quoteAPI.getAll();
      
      // Multiple safe access patterns
      const quotesData = 
        response?.data?.data?.quotes || 
        response?.data?.quotes || 
        [];
      
      console.log('Quotes loaded:', quotesData);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  // Safe rendering - always ensure quotes is an array
  const quotesArray = Array.isArray(quotes) ? quotes : [];

  return (
    <div className="flex-1">
      <Header 
        title="Quote Requests" 
        subtitle="Manage construction quote requests"
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {quotesArray.map((quote, index) => (
            <motion.div
              key={quote._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{quote.name || 'No Name'}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Mail size={14} />
                    {quote.email || 'No email'}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone size={14} />
                    {quote.phoneCountryCode} {quote.telephone || 'No phone'}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Project Type</p>
                  <p className="text-gray-900 capitalize">
                    {quote.projectType?.replace(/-/g, ' ') || 'Not specified'}
                  </p>
                </div>
                
                {quote.budget && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Budget</p>
                    <p className="text-gray-900">
                      {quote.budget === 'under-10k' && 'Under $10,000'}
                      {quote.budget === '10k-50k' && '$10,000 - $50,000'}
                      {quote.budget === '50k-100k' && '$50,000 - $100,000'}
                      {quote.budget === '100k-500k' && '$100,000 - $500,000'}
                      {quote.budget === '500k-plus' && '$500,000+'}
                      {!['under-10k', '10k-50k', '50k-100k', '100k-500k', '500k-plus'].includes(quote.budget) && 
                        'Not specified'}
                    </p>
                  </div>
                )}

                {quote.timeline && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Timeline</p>
                    <p className="text-gray-900 capitalize">
                      {quote.timeline?.replace(/-/g, ' ') || 'Not specified'}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Message</p>
                <p className="text-gray-900 text-sm">{quote.message || 'No message provided'}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'Unknown date'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {quotesArray.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <FileText size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Quote Requests Yet
            </h3>
            <p className="text-gray-600">
              Customer quote requests will appear here when they submit forms.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quotes;