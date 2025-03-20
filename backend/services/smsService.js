// Format the phone number with +91 prefix
const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters (spaces, dashes, etc.)
  let cleaned = phone.replace(/\D/g, '');
  
  // If it doesn't start with 91, add it
  if (!cleaned.startsWith('91')) {
    cleaned = `91${cleaned}`;
  }
  
  // Add + prefix
  return `+${cleaned}`;
};

// Mock SMS sending function
const sendSMS = async (phone, message) => {
  try {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    // Always log the SMS for debugging purposes
    console.log(`\n===== SMS NOTIFICATION =====`);
    console.log(`TO: ${formattedPhone}`);
    console.log(`MESSAGE: ${message}`);
    console.log(`===========================\n`);
    
    // Generate a mock SID for consistency with previous code
    const mockSid = 'SM' + Array(32).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    return { 
      success: true, 
      sid: mockSid,
      message: 'SMS sent successfully (mock)'
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send SMS'
    };
  }
};

// Mock OTP sending function
const sendOtpSMS = async (phone) => {
  try {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    // Always log the verification attempt for debugging purposes
    console.log(`\n===== VERIFICATION REQUEST =====`);
    console.log(`TO: ${formattedPhone}`);
    console.log(`Using mock verification service`);
    console.log(`=================================\n`);
    
    console.log(`For testing purposes, use code: 123456`);
    
    // Generate a fake verification SID
    const mockSid = 'VE' + Array(32).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    return { 
      success: true, 
      sid: mockSid,
      message: 'Verification code sent successfully (mock - use code 123456)'
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send verification code'
    };
  }
};

// Mock OTP verification function
const verifyOTP = async (phone, otp) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log(`\n===== VERIFY OTP REQUEST =====`);
    console.log(`Phone: ${formattedPhone}`);
    console.log(`OTP: ${otp}`);
    console.log(`================================\n`);
    
    // Accept code 123456 for all numbers in mock mode
    if (otp === '123456') {
      console.log('MOCK MODE: Accepting test code 123456');
      
      return {
        success: true,
        status: 'approved',
        message: 'OTP verified successfully (mock)'
      };
    }
    
    return {
      success: false,
      status: 'rejected',
      message: 'Invalid OTP'
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to verify OTP'
    };
  }
};

// Additional helper functions for specific messages
const sendRegistrationConfirmationSMS = async (phone, isDonor = true) => {
  const message = isDonor 
    ? 'Thank you for registering as a blood donor! Your contribution can save lives.'
    : 'Your blood request has been registered successfully. You will be notified when a donor is found.';
  
  return sendSMS(phone, message);
};

const sendDonorMatchSMS = async (phone, count) => {
  const message = `Good news! ${count} potential donor(s) have been found for your blood request.`;
  return sendSMS(phone, message);
};

const sendRequestNotificationToDonor = async (phone, bloodType) => {
  const message = `Urgent: A patient needs your ${bloodType} blood. Please check your donor dashboard for details.`;
  return sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendOtpSMS,
  verifyOTP,
  sendRegistrationConfirmationSMS,
  sendDonorMatchSMS,
  sendRequestNotificationToDonor
}; 