const axios = require("axios");

exports.sendSMS = async (phone, otp) => {
  try {
    // 🔥 HARD-CODED CREDENTIALS
    const USERNAME = "rroomtr";
    const PASSWORD = "room@1234";
    const SENDER = "RROOMS";
    const TEMPLATE_ID = "1407169570875594932";
    const ENTITY_ID = "1401560000000064644";


    // 🔥 MESSAGE
    const message = `${otp} is the OTP for login, please do not share the OTP with anyone. Team RROOMS`;

    // 🔥 URL BUILD
    const url = `https://bulksmsapi.smartping.ai/?username=${USERNAME}&password=${PASSWORD}&messageType=text&mobile=91${phone}&senderId=${SENDER}&ContentID=${TEMPLATE_ID}&EntityID=${ENTITY_ID}&message=${message}`;

    // 🔥 API CALL
    const response = await axios.get(url);

    console.log("SMS SUCCESS:", response.data);

    console.log("OTP:", otp); // testing
    console.log("phone:", phone); // testing

  } catch (err) {
    console.error("SMS ERROR:", err.response?.data || err.message);
  }
};