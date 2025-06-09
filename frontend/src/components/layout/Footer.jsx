import React from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { useContext } from 'react';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  const handleWhatsAppClick = () => {
    const phoneNumber = '916361943681';
    const message = 'Hello! I need assistance with blood donation.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                <a href="tel:+916361943681" className="hover:text-red-600 transition-colors">
                  +91 6361943681
                </a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                <a href="mailto:support@bloodlink.com" className="hover:text-red-600 transition-colors">
                  support@bloodlink.com
                </a>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <span>Bangalore, Karnataka, India</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-red-600 transition-colors">About Us</a>
              </li>
              <li>
                <a href="/donate" className="hover:text-red-600 transition-colors">Donate Blood</a>
              </li>
              <li>
                <a href="/request" className="hover:text-red-600 transition-colors">Request Blood</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-red-600 transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWhatsAppClick}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                aria-label="Contact on WhatsApp"
              >
                <FaWhatsapp className="text-2xl" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} BloodLink. All rights reserved.</p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center space-x-2"
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
        <span className="hidden sm:inline">Need Help?</span>
      </motion.button>
    </footer>
  );
};

export default Footer; 