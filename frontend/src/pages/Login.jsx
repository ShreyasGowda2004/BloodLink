import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { loginDonor } from '../services/donorService';

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Validate phone number and password
      if (!formData.phone || !formData.password) {
        setError('Please enter both phone number and password');
        setIsSubmitting(false);
        return;
      }
      
      // Validate phone number format
      if (!/^\d{10}$/.test(formData.phone)) {
        setError('Please enter a valid 10-digit phone number');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Attempting to login with phone:', formData.phone);
      
      // Call login API
      const response = await loginDonor(formData);
      
      if (response.success) {
        console.log('Login successful:', response.data);
        // Store donor data in localStorage
        localStorage.setItem('donor', JSON.stringify(response.data));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to donor dashboard
        navigate('/donor-dashboard');
      } else {
        console.error('Login failed:', response.error);
        setError(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login service unavailable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`min-h-screen py-12 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">Donor Login</h1>
          
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <form onSubmit={handleSubmit}>
              {/* Phone */}
              <div className="mb-4">
                <label className="block mb-2 font-medium" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              {/* Password */}
              <div className="mb-6">
                <label className="block mb-2 font-medium" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>
              
              {error && (
                <div className="mb-4 text-center text-red-500 font-medium">
                  {error}
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg ${
                  isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                } text-white font-semibold`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                Don't have a donor account?{' '}
                <Link to="/donor-registration" className="text-red-500 hover:underline">
                  Register as a Donor
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 