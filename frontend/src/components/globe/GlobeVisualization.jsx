import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

// Sample data for blood donation statistics by country
const countryData = [
  { id: 1, name: 'United States', donations: 13500000, color: '#e53e3e' },
  { id: 2, name: 'India', donations: 9800000, color: '#dd6b20' },
  { id: 3, name: 'China', donations: 15200000, color: '#d69e2e' },
  { id: 4, name: 'Brazil', donations: 3700000, color: '#38a169' },
  { id: 5, name: 'Russia', donations: 2900000, color: '#3182ce' },
  { id: 6, name: 'Germany', donations: 2500000, color: '#805ad5' },
  { id: 7, name: 'United Kingdom', donations: 2100000, color: '#d53f8c' },
  { id: 8, name: 'France', donations: 1900000, color: '#667eea' },
  { id: 9, name: 'Japan', donations: 1800000, color: '#ed64a6' },
  { id: 10, name: 'Canada', donations: 1200000, color: '#48bb78' },
  { id: 11, name: 'Australia', donations: 1100000, color: '#9f7aea' },
  { id: 12, name: 'Spain', donations: 950000, color: '#4299e1' },
];

const GlobeVisualization = () => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (country) => {
    setSelectedCountry(selectedCountry?.id === country.id ? null : country);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Rotating background globe */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url("https://raw.githubusercontent.com/your-username/your-repo/main/public/images/globe.png")',
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.05s linear',
        }}
      />

      {/* Content overlay */}
      <div className={`relative p-4 ${darkMode ? 'bg-gray-900/80 text-white' : 'bg-white/80 text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-6">Global Blood Donation Statistics</h2>
        
        {/* World stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg backdrop-blur-sm ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-md`}>
            <h3 className="text-lg font-semibold mb-1">Total Donations</h3>
            <p className="text-3xl font-bold">{(countryData.reduce((sum, country) => sum + country.donations, 0) / 1000000).toFixed(1)}M</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>units annually</p>
          </div>
          <div className={`p-4 rounded-lg backdrop-blur-sm ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-md`}>
            <h3 className="text-lg font-semibold mb-1">Top Donor</h3>
            <p className="text-3xl font-bold">China</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>15.2M units annually</p>
          </div>
          <div className={`p-4 rounded-lg backdrop-blur-sm ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} shadow-md`}>
            <h3 className="text-lg font-semibold mb-1">Countries Analyzed</h3>
            <p className="text-3xl font-bold">{countryData.length}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>major donor nations</p>
          </div>
        </div>

        {/* Countries grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countryData.map((country) => (
            <motion.div
              key={country.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCountryClick(country)}
              className={`p-4 rounded-lg cursor-pointer transition-colors backdrop-blur-sm shadow-md ${
                selectedCountry?.id === country.id
                  ? `border-2 ${darkMode ? 'border-blue-500 bg-gray-800/80' : 'border-blue-500 bg-white/80'}`
                  : `${darkMode ? 'bg-gray-800/80 hover:bg-gray-700/80' : 'bg-white/80 hover:bg-gray-50/80'}`
              }`}
            >
              <div className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: country.color }}
                ></div>
                <h3 className="font-medium">{country.name}</h3>
              </div>
              <p className="text-2xl font-bold">
                {(country.donations / 1000000).toFixed(1)}M
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                annual blood donations
              </p>

              {selectedCountry?.id === country.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <p className="text-sm mb-1">
                    <span className="font-medium">Population coverage:</span> {Math.round(country.donations / (country.id * 5000000) * 100)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Donation centers:</span> {Math.round(country.donations / 25000)}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Data source footnote */}
        <p className={`mt-6 text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Data represents estimated annual blood donations based on WHO statistics.
        </p>
      </div>
    </div>
  );
};

export default GlobeVisualization;