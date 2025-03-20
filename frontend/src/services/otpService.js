import api from './api';

// Format phone to remove +91 prefix if present
const formatPhoneForApi = (phone) => {
  // Remove any non-digit characters (spaces, dashes, etc.)
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with +91 or 91, remove it to get just the 10-digit number
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  
  return cleaned;
};

// Send OTP
export const sendOTP = async (phone, donorData) => {
  try {
    const formattedPhone = formatPhoneForApi(phone);
    console.log('Sending OTP to phone:', formattedPhone);
    
    // Create request data
    const requestData = {
      phone: formattedPhone
    };
    
    // Only add donorData if it's provided and is a valid object
    if (donorData && typeof donorData === 'object' && Object.keys(donorData).length > 0) {
      requestData.donorData = donorData;
    }
    
    console.log('Request data for OTP send:', JSON.stringify(requestData, null, 2));
    
    const response = await api.post('/otp/send', requestData);
    
    // Log the response for debugging
    console.log('OTP Service Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  try {
    const formattedPhone = formatPhoneForApi(phone);
    console.log('Verifying OTP for phone:', formattedPhone, 'OTP:', otp);
    
    const requestData = { 
      phone: formattedPhone, 
      otp: otp.toString() // Ensure OTP is sent as string
    };
    
    console.log('Request data for OTP verification:', JSON.stringify(requestData, null, 2));
    
    const response = await api.post('/otp/verify', requestData);
    
    // Log the response for debugging
    console.log('OTP Verification Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

// Resend OTP
export const resendOTP = async (phone) => {
  try {
    const formattedPhone = formatPhoneForApi(phone);
    console.log('Resending OTP to phone:', formattedPhone);
    
    const requestData = { phone: formattedPhone };
    console.log('Request data for OTP resend:', JSON.stringify(requestData, null, 2));
    
    const response = await api.post('/otp/resend', requestData);
    
    // Log the response for debugging
    console.log('Resend OTP Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error resending OTP:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
}; 