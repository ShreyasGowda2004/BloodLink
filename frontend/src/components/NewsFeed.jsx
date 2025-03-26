import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaNewspaper, FaTimes } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const NewsFeed = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using a CORS proxy to access WHO RSS feed
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const whoRssFeed = 'https://www.who.int/rss-feeds/news-english.xml';
        const response = await fetch(corsProxy + encodeURIComponent(whoRssFeed));
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        
        const newsItems = Array.from(items)
          .filter(item => {
            const title = item.getElementsByTagName('title')[0]?.textContent.toLowerCase() || '';
            return title.includes('blood') || title.includes('donation') || title.includes('transfusion');
          })
          .slice(0, 5)
          .map(item => ({
            title: item.getElementsByTagName('title')[0]?.textContent || '',
            link: item.getElementsByTagName('link')[0]?.textContent || '',
            pubDate: new Date(item.getElementsByTagName('pubDate')[0]?.textContent || ''),
            description: item.getElementsByTagName('description')[0]?.textContent || '',
          }));

        setNews(newsItems);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNews();
    }
  }, [isOpen]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
        aria-label="Open news feed"
      >
        <FaNewspaper className="text-xl" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-2xl mx-4 rounded-lg shadow-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Blood Donation News
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      <span className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Loading news...
                      </span>
                  </div>
                ) : news.length > 0 ? (
                  <div className="space-y-4">
                    {news.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <h3 className={`text-lg font-medium mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </h3>
                          <p className={`text-sm mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                          <span className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {formatDate(item.pubDate)}
                          </span>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    No blood-related news available at the moment.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsFeed; 