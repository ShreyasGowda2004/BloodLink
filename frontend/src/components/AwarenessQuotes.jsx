// src/components/AwarenessQuotes.jsx
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const AwarenessQuotes = ({ quotes }) => {
  const { darkMode } = useContext(ThemeContext);
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div 
        className={`relative h-64 rounded-xl overflow-hidden shadow-lg flex items-center justify-center p-8 ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}
      >
        {/* Blood drop background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="blood-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M5 0 C5 0 0 5 0 7.5 C0 10 2.5 12.5 5 12.5 C7.5 12.5 10 10 10 7.5 C10 5 5 0 5 0 Z" fill="currentColor" className="text-red-600" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#blood-pattern)" />
          </svg>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center z-10"
          >
            <motion.p 
              className="text-2xl md:text-3xl font-medium italic mb-6"
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              "{quotes[currentQuote]}"
            </motion.p>
            
            <div className="flex justify-center space-x-2">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentQuote === index 
                      ? 'bg-red-600' 
                      : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Quote ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AwarenessQuotes;