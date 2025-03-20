const Otp = require('../models/otp');
const smsService = require('../services/smsService');

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    console.log('OTP Send Request Body:', JSON.stringify(req.body, null, 2));
    const { phone, donorData } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    // Send OTP using Twilio Verify
    const smsResult = await smsService.sendOtpSMS(phone);
    
    if (!smsResult.success) {
      console.error('SMS Service Error:', smsResult.error || smsResult.message);
      return res.status(500).json({
        success: false,
        error: smsResult.message
      });
    }
    
    // Store donor data in session or temporary storage
    // This will be used when verifying the OTP
    try {
      const otp = new Otp({
        phone,
        donorData: donorData || {}, // Ensure we always have an object even if donorData is undefined
        verificationSid: smsResult.sid
      });
      
      console.log('Saving OTP data:', JSON.stringify({
        phone,
        hasDonorData: !!donorData,
        verificationSid: smsResult.sid
      }, null, 2));
      
      await otp.save();
      
      // Always log the verification SID prominently in the console for development/testing
      console.log(`\n==================================================`);
      console.log(`🔐 OTP REQUEST FOR ${phone} 🔐`);
      console.log(`Verification SID: ${smsResult.sid}`);
      console.log(`==================================================\n`);
      
      res.status(200).json({
        success: true,
        message: 'Verification code sent successfully to your mobile number'
      });
    } catch (dbError) {
      console.error('Database Error while saving OTP record:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Server Error: Failed to save OTP data - ' + dbError.message
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    console.log('OTP Verify Request Body:', JSON.stringify(req.body, null, 2));
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }
    
    // Verify OTP using Twilio Verify
    const verificationResult = await smsService.verifyOTP(phone, otp);
    
    if (!verificationResult.success) {
      console.error('OTP Verification Error:', verificationResult.error || verificationResult.message);
      return res.status(400).json({
        success: false,
        error: verificationResult.message
      });
    }
    
    // Get the stored donor data
    const otpRecord = await Otp.findOne({ phone });
    if (!otpRecord) {
      console.error('No OTP record found for phone:', phone);
      return res.status(400).json({
        success: false,
        error: 'No OTP request found for this phone number'
      });
    }
    
    // Delete the OTP record after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      donorData: otpRecord.donorData
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    console.log('OTP Resend Request Body:', JSON.stringify(req.body, null, 2));
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    // Check if there's an existing OTP request
    const existingOtp = await Otp.findOne({ phone });
    
    if (!existingOtp) {
      console.error('No existing OTP record found for phone:', phone);
      return res.status(400).json({
        success: false,
        error: 'No OTP request found for this phone number'
      });
    }
    
    // Send new verification code using Twilio Verify
    const smsResult = await smsService.sendOtpSMS(phone);
    
    if (!smsResult.success) {
      console.error('SMS Service Error on resend:', smsResult.error || smsResult.message);
      return res.status(500).json({
        success: false,
        error: smsResult.message
      });
    }
    
    // Update the verification SID
    existingOtp.verificationSid = smsResult.sid;
    await existingOtp.save();
    
    // Always log the verification SID prominently in the console for development/testing
    console.log(`\n==================================================`);
    console.log(`🔐 RESENT OTP REQUEST FOR ${phone} 🔐`);
    console.log(`New Verification SID: ${smsResult.sid}`);
    console.log(`==================================================\n`);
    
    res.status(200).json({
      success: true,
      message: 'Verification code resent successfully to your mobile number'
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
}; 