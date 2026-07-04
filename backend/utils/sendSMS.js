// ================================
// SMS Utility — Twilio
// ================================
// To activate real SMS:
// 1. npm install twilio (already in package.json)
// 2. Add to .env:
//    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//    TWILIO_AUTH_TOKEN=your_auth_token
//    TWILIO_PHONE=+1XXXXXXXXXX
// 3. Uncomment the Twilio block below

const sendSMS = async (phone, message) => {
  try {
    // ── TWILIO (uncomment when credentials are ready) ──
    // const twilio = require("twilio");
    // const client = twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE,
    //   to: phone,
    // });
    // console.log("✅ SMS sent to", phone);

    // ── DEMO MODE (logs to console) ──
    console.log("📱 SMS Notification:");
    console.log("  To:", phone);
    console.log("  Message:", message);
  } catch (err) {
    console.log("❌ SMS Error:", err.message);
  }
};

module.exports = sendSMS;