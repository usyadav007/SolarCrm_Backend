const PDFDocument = require("pdfkit");
const fs = require("fs");

exports.generateInvoice = (data, filePath) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(20).text("Invoice", { align: "center" });

  doc.moveDown();

  // Customer Info
  doc.fontSize(12).text(`Customer: ${data.customer}`);
  doc.text(`Amount: ₹${data.amount}`);
  doc.text(`Payment ID: ${data.payment_id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

  doc.text("Thank you for your payment!");

  doc.end();
};