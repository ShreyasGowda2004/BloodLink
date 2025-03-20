// src/components/DonationStats.jsx
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const DonationStats = () => {
  const { darkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState([
    { id: 1, title: 'Lives Saved', value: 0, target: 4500, icon: '❤️', color: 'red' },
    { id: 2, title: 'Active Donors', value: 0, target: 1200, icon: '👥', color: 'blue' },
    { id: 3, title: 'Blood Units', value: 0, target: 9800, icon: '💉', color: 'purple' },
    { id: 4, title: 'Donation Centers', value: 0, target: 120, icon: '🏥', color: 'green' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          if (stat.value < stat.target) {
            const increment = Math.ceil(stat.target / 50);
            const newValue = Math.min(stat.value + increment, stat.target);
            return { ...stat, value: newValue };
          }
          return stat;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getColor = (color) => {
    switch (color) {
      case 'red':
        return darkMode ? 'from-red-700 to-red-900' : 'from-red-500 to-red-600';
      case 'blue':
        return darkMode ? 'from-blue-700 to-blue-900' : 'from-blue-500 to-blue-600';
      case 'purple':
        return darkMode ? 'from-purple-700 to-purple-900' : 'from-purple-500 to-purple-600';
      case 'green':
        return darkMode ? 'from-green-700 to-green-900' : 'from-green-500 to-green-600';
      default:
        return darkMode ? 'from-gray-700 to-gray-900' : 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className={`h-2 bg-gradient-to-r ${getColor(stat.color)}`}></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-4xl font-bold mb-2">
              {stat.value.toLocaleString()}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {stat.title === 'Lives Saved' ? 'Through blood donations' : 
               stat.title === 'Active Donors' ? 'Registered in our platform' :
               stat.title === 'Blood Units' ? 'Collected this year' : 
               'Across the country'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DonationStats;