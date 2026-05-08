const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("📧 Email sent to:", to);

  } catch (err) {
    console.error("Email Error:", err);
  }
};


exports.sendInvoiceEmail = async (to, subject, text, filePath) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: "invoice.pdf",
          path: filePath
        }
      ]
    });

    console.log("📧 Invoice sent to:", to);

  } catch (err) {
    console.error("Email Error:", err);
  }
};