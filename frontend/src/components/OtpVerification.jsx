import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { sendOTP, verifyOTP, resendOTP } from '../services/otpService';

const OtpVerification = ({ phone, onVerificationSuccess, formData, isRequest = false }) => {
  const { darkMode } = useContext(ThemeContext);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Phone number is required');
      return;
    }
    
    try {
      setIsVerifying(true);
      setError('');
      
      const response = await sendOTP(phone, formData);
      setOtpSent(true);
      setShowOtpInput(true);
      startCountdown();
      
      // In development mode, auto-fill the OTP if it's included in the response
      if (response.otp) {
        console.log('Development OTP received:', response.otp);
        setOtp(response.otp);
      }
      
      setIsVerifying(false);
    } catch (error) {
      setIsVerifying(false);
      setError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    try {
      setIsVerifying(true);
      setError('');
      
      await verifyOTP(phone, otp);
      setIsVerified(true);
      setIsVerifying(false);
      onVerificationSuccess();
    } catch (error) {
      setIsVerifying(false);
      setError(error.response?.data?.error || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setIsVerifying(true);
      setError('');
      
      const response = await resendOTP(phone);
      startCountdown();
      
      // In development mode, auto-fill the OTP if it's included in the response
      if (response.otp) {
        console.log('Development OTP received:', response.otp);
        setOtp(response.otp);
      }
      
      setIsVerifying(false);
    } catch (error) {
      setIsVerifying(false);
      setError(error.response?.data?.error || 'Failed to resend OTP');
    }
  };

  const formatPhoneNumber = (phone) => {
    return `+91 ${phone}`;
  };

  return (
    <div className="mt-4 space-y-4">
      {isVerified ? (
        <div className={`p-3 rounded-md ${darkMode ? 'bg-green-800' : 'bg-green-100'}`}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>Phone number verified successfully!</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex space-x-2">
            {!showOtpInput ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendOtp}
                disabled={isVerifying}
                className={`px-4 py-2 rounded-md text-white ${isVerifying ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isVerifying ? 'Sending...' : 'Verify Number'}
              </motion.button>
            ) : (
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className={`flex-1 p-2 rounded-md border ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    maxLength={6}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || !otp || otp.length < 6}
                    className={`px-4 py-2 rounded-md text-white ${
                      isVerifying || !otp || otp.length < 6 
                        ? 'bg-gray-500' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isVerifying ? 'Verifying...' : 'Submit'}
                  </motion.button>
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isVerifying}
                    className={`text-sm ${
                      countdown > 0 || isVerifying 
                        ? 'text-gray-500' 
                        : darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className={`p-2 rounded-md ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}
          
          {otpSent && (
            <div className={`p-2 rounded-md ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
              OTP sent to {formatPhoneNumber(phone)}. Valid for 10 minutes.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OtpVerification; 