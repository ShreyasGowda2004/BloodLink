const twilio = require('twilio');

// Initialize Twilio client
const initTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.error('Twilio credentials not configured');
    return null;
  }

  try {
    return twilio(accountSid, authToken);
  } catch (error) {
    console.error('Error initializing Twilio client:', error);
    return null;
  }
};

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

// Send SMS using Twilio
const sendSMS = async (phone, message) => {
  try {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    // Always log the SMS for debugging purposes
    console.log(`\n===== SMS NOTIFICATION =====`);
    console.log(`TO: ${formattedPhone}`);
    console.log(`MESSAGE: ${message}`);
    console.log(`===========================\n`);
    
    // Initialize Twilio client
    const client = initTwilioClient();
    if (!client) {
      throw new Error('Twilio client not initialized');
    }

    // Send SMS using Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`SMS sent successfully to ${formattedPhone}`);
    console.log(`Message SID: ${result.sid}`);
    
    return { 
      success: true, 
      sid: result.sid,
      message: 'SMS sent successfully'
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

// Send OTP using Twilio Verify
const sendOtpSMS = async (phone) => {
  try {
    // Format the phone number
    const formattedPhone = formatPhoneNumber(phone);
    
    // Always log the verification attempt for debugging purposes
    console.log(`\n===== VERIFICATION REQUEST =====`);
    console.log(`TO: ${formattedPhone}`);
    console.log(`Using Twilio Verify API`);
    console.log(`=================================\n`);
    
    // Initialize Twilio client
    const client = initTwilioClient();
    if (!client) {
      throw new Error('Twilio client not initialized');
    }
    
    // Get the verification service SID from environment
    const serviceSid = process.env.TWILIO_VERIFY_SID;
    
    if (!serviceSid) {
      throw new Error('Twilio Verify Service SID not configured in environment');
    }

    console.log(`Using Twilio Verify Service SID: ${serviceSid}`);

    // Development environment flag - can be set to true in production when ready
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // In development, we'll create a mock verification for any phone number except our test number
    const testPhone = '+916361943681'; // The only number that works with our trial account
    
    if (isDevelopment && formattedPhone !== testPhone) {
      console.log(`DEVELOPMENT MODE: Creating mock verification for ${formattedPhone}`);
      console.log(`For testing purposes, use code: 123456`);
      
      // Generate a fake verification SID
      const mockSid = 'VE' + Array(32).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      return { 
        success: true, 
        sid: mockSid,
        message: 'Verification code sent successfully (DEV MODE - use code 123456)'
      };
    }

    // For production or test number in development
    try {
      // Send verification code using Twilio Verify
      const result = await client.verify.v2
        .services(serviceSid)
        .verifications.create({
          to: formattedPhone,
          channel: 'sms'
        });

      console.log(`Verification initiated for ${formattedPhone}`);
      console.log(`Verification SID: ${result.sid}`);
      console.log(`Status: ${result.status}`);
      
      return { 
        success: true, 
        sid: result.sid,
        message: 'Verification code sent successfully'
      };
    } catch (twilioError) {
      console.error('Twilio API error:', twilioError);
      
      // If in development, create a mock verification as fallback
      if (isDevelopment) {
        console.log(`FALLBACK: Creating mock verification for ${formattedPhone}`);
        console.log(`For testing purposes, use code: 123456`);
        
        const mockSid = 'VE' + Array(32).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        return { 
          success: true, 
          sid: mockSid,
          message: 'Verification code sent successfully (DEV MODE - use code 123456)'
        };
      }
      
      throw twilioError;
    }
  } catch (error) {
    console.error('Error sending verification code:', error);
    console.error('Full error details:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Failed to send verification code'
    };
  }
};

// Verify OTP using Twilio Verify
const verifyOTP = async (phone, otp) => {
  try {
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log(`\n===== VERIFY OTP REQUEST =====`);
    console.log(`Phone: ${formattedPhone}`);
    console.log(`OTP: ${otp}`);
    console.log(`================================\n`);
    
    const client = initTwilioClient();
    
    if (!client) {
      throw new Error('Twilio client not initialized');
    }
    
    // Get the verification service SID from environment
    const serviceSid = process.env.TWILIO_VERIFY_SID;
    
    if (!serviceSid) {
      throw new Error('Twilio Verify Service SID not configured in environment');
    }

    console.log(`Using Twilio Verify Service SID: ${serviceSid}`);
    
    // Development environment flag
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Test phone number that works with our trial account
    const testPhone = '+916361943681';
    
    // In development, accept code 123456 for any phone number except our test number
    if (isDevelopment && formattedPhone !== testPhone && otp === '123456') {
      console.log('DEVELOPMENT MODE: Accepting test code 123456');
      
      return {
        success: true,
        status: 'approved',
        message: 'OTP verified successfully (DEV MODE)'
      };
    }

    // For production or test number in development
    try {
      const result = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({
          to: formattedPhone,
          code: otp
        });

      console.log(`Verification check result: ${result.status}`);
      
      return {
        success: result.status === 'approved',
        status: result.status,
        message: result.status === 'approved' ? 'OTP verified successfully' : 'Invalid OTP'
      };
    } catch (twilioError) {
      console.error('Twilio API error during verification:', twilioError);
      
      // If in development, accept 123456 as fallback
      if (isDevelopment && otp === '123456') {
        console.log('FALLBACK: Accepting test code 123456 after Twilio API error');
        
        return {
          success: true,
          status: 'approved',
          message: 'OTP verified successfully (DEV MODE)'
        };
      }
      
      throw twilioError;
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    console.error('Full error details:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to verify OTP'
    };
  }
};

// Send registration confirmation SMS
const sendRegistrationConfirmationSMS = async (phone, isDonor = true) => {
  const message = isDonor 
    ? `Thank you for registering as a blood donor with Blood Donation Platform. Your generosity can save lives.` 
    : `Your blood request has been registered. We will notify you when donors are found.`;
  return sendSMS(phone, message);
};

// Send donor match notification SMS
const sendDonorMatchSMS = async (phone, count) => {
  const message = `We found ${count} potential blood donors matching your request. Please check the app for details.`;
  return sendSMS(phone, message);
};

// Send request notification to donor
const sendRequestNotificationToDonor = async (phone, bloodType) => {
  const message = `Someone in your area needs ${bloodType} blood urgently. Please check the Blood Donation Platform app for details.`;
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