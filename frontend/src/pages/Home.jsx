// src/pages/Home.jsx
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import GlobeVisualization from '../components/globe/GlobeVisualization';
import DonationStats from '../components/DonationStats';
import AwarenessQuotes from '../components/AwarenessQuotes';

const Home = () => {
  const { darkMode } = useContext(ThemeContext);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  // Set isVisible to true after component mounts for entry animations
  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate quotes
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    
    return () => clearInterval(quoteInterval);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  const bloodDropAnimation = {
    initial: { y: -10, opacity: 0, scale: 0.8 },
    animate: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        y: { repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.8 },
        scale: { duration: 0.8 }
      }
    }
  };

  const quotes = [
    "Donate blood and be the reason for someone's existence.",
    "A single drop of blood can make a huge difference.",
    "Your blood donation can give a precious smile to someone's face.",
    "The blood you donate gives someone another chance at life.",
    "Blood donation costs nothing, but it can mean everything to someone in need."
  ];
  
  const bloodTypes = [
    { type: "A+", desc: "Can donate to: A+, AB+" },
    { type: "A-", desc: "Can donate to: A+, A-, AB+, AB-" },
    { type: "B+", desc: "Can donate to: B+, AB+" },
    { type: "B-", desc: "Can donate to: B+, B-, AB+, AB-" },
    { type: "AB+", desc: "Can donate to: AB+" },
    { type: "AB-", desc: "Can donate to: AB+, AB-" },
    { type: "O+", desc: "Can donate to: A+, B+, AB+, O+" },
    { type: "O-", desc: "Universal donor (all blood types)" }
  ];
  
  const facts = [
    { 
      id: 1, 
      title: "Save Lives", 
      icon: "❤️", 
      description: "Every blood donation can save up to 3 lives. Your single donation can help multiple patients in need." 
    },
    { 
      id: 2, 
      title: "Quick Process", 
      icon: "⏱️", 
      description: "The donation process takes only about 10-15 minutes. It's a small time commitment for a huge impact." 
    },
    { 
      id: 3, 
      title: "Regular Need", 
      icon: "🔄", 
      description: "Blood has a limited shelf life and must be replenished constantly. Regular donations help maintain supply." 
    },
    { 
      id: 4, 
      title: "Health Benefits", 
      icon: "🩺", 
      description: "Donating blood can reduce the risk of heart disease and help in maintaining good health." 
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1615461066841-6116e61890c5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: darkMode ? 'brightness(0.4)' : 'brightness(0.8)'
          }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <div className="absolute inset-0 z-0">
          {/* Red overlay with pulse animation */}
          <motion.div
            className="absolute inset-0 bg-red-600"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg"
              variants={staggerItem}
            >
              <motion.span 
                className="text-red-500 inline-block"
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 5px rgba(239, 68, 68, 0.5)",
                    "0 0 15px rgba(239, 68, 68, 0.8)",
                    "0 0 5px rgba(239, 68, 68, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Donate Blood.
              </motion.span>{" "}
              <span className="text-white">Save Lives.</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white drop-shadow-md"
              variants={staggerItem}
            >
              Your donation is a lifeline for someone in need. Be a hero today.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerItem}
            >
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 bg-red-600 text-white rounded-full font-semibold shadow-lg hover:bg-red-700 transition-colors"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Donor
                </motion.button>
              </Link>
              <Link to="/request">
                <motion.button
                  className={`px-8 py-4 rounded-full font-semibold border-2 border-white text-white shadow-lg hover:bg-white hover:text-red-600 transition-all`}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request Blood
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div 
              variants={staggerItem}
              className="mt-8"
            >
              <Link to="/request-status">
                <motion.button
                  className={`px-6 py-2 rounded-full font-medium bg-transparent text-white border border-white/40 hover:border-white/80 transition-all text-sm`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Check Request Status
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated blood drops */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={bloodDropAnimation}
              initial="initial"
              animate="animate"
              transition={{
                delay: i * 0.2
              }}
            >
              <svg width={20 + i * 5} height={30 + i * 5} viewBox="0 0 30 45">
                <motion.path
                  d="M15 0 C15 0 0 20 0 30 C0 38.284 6.716 45 15 45 C23.284 45 30 38.284 30 30 C30 20 15 0 15 0 Z"
                  fill="rgba(220, 38, 38, 0.8)"
                  animate={{ 
                    fill: ["rgba(220, 38, 38, 0.8)", "rgba(239, 68, 68, 0.9)"],
                    y: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 2 + i * 0.5, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                />
              </svg>
            </motion.div>
          ))}
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>
      
      {/* Blood Types Carousel Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Blood Types</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-80">
              Different blood types can help different patients. Find out who you can save.
            </p>
          </motion.div>
          
          <div className="flex overflow-x-auto pb-6 scrollbar-hide space-x-4">
            {bloodTypes.map((blood, index) => (
              <motion.div
                key={blood.type}
                className={`flex-shrink-0 w-64 h-48 rounded-xl shadow-lg p-6 cursor-pointer ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 10 }}
                >
                  <span className="text-red-600 text-2xl font-bold">{blood.type}</span>
                </motion.div>
                <h3 className="font-bold text-center mb-2">{blood.type}</h3>
                <p className={`text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{blood.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Facts Section with Interactive Cards */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Donate Blood?</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-80">
              Your donation makes a real difference in someone's life.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facts.map((fact, index) => (
              <motion.div
                key={fact.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ 
                  y: -10,
                  boxShadow: darkMode 
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6 cursor-pointer transition-all`}
                onClick={() => setActiveCard(activeCard === fact.id ? null : fact.id)}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{fact.icon}</div>
                <h3 className="text-xl font-bold mb-2">{fact.title}</h3>
                <AnimatePresence>
                  {(activeCard === fact.id || !activeCard) && (
                    <motion.p 
                      className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {fact.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Floating Quote Section */}
      <section className={`py-20 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-red-50'}`}>
        <motion.div 
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-red-500 opacity-10"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-red-500 opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-6">❝</div>
                <h2 className="text-2xl md:text-3xl font-medium italic mb-6">
                  {quotes[currentQuoteIndex]}
                </h2>
                <div className="flex justify-center space-x-2 mt-6">
                  {quotes.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`w-3 h-3 rounded-full ${currentQuoteIndex === index 
                        ? 'bg-red-500' 
                        : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                      onClick={() => setCurrentQuoteIndex(index)}
                      whileHover={{ scale: 1.5 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* Globe Visualization Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Global Blood Donation Impact</h2>
            <p className="text-xl max-w-3xl mx-auto opacity-80">
              Explore blood donation statistics around the world and see the impact of donors like you.
            </p>
          </motion.div>
          
          <motion.div 
            className="h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <GlobeVisualization />
          </motion.div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Blood Donation Statistics</h2>
            <DonationStats />
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className={`py-20 ${darkMode ? 'bg-red-900' : 'bg-red-600'} text-white`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              animate={{ 
                scale: [1, 1.03, 1],
                textShadow: [
                  "0 0 0px rgba(255,255,255,0.5)",
                  "0 0 10px rgba(255,255,255,0.8)",
                  "0 0 0px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Ready to Save Lives?
            </motion.h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Every drop counts. Join our community of life-savers today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  className="px-8 py-4 bg-white text-red-600 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register as Donor
                </motion.button>
              </Link>
              <Link to="/admin/login">
                <motion.button
                  className="px-8 py-4 border-2 border-white rounded-full font-semibold text-white hover:bg-white hover:text-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Login
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white rounded-full font-semibold text-white hover:bg-white hover:text-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Donor Login
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
