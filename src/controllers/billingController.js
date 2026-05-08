const { Invoice, Payment, Customer, Lead } = require("../models");
const { sendInvoiceEmail } = require("../utils/emailService");
const { generateInvoice } = require("../utils/invoiceGenerator");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.createInvoice = async (req, res) => {
  try {
    const data = {
      ...req.body,
      due_amount: req.body.total_amount,
      created_at: new Date()
    };

    const invoice = await Invoice.create(data);

    return successResponse(res, {invoice }, "Create Data successful");

  } catch (err) {
    
    return errorResponse(res, "Create data failed", err.message);
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { invoice_id, amount, payment_mode, notes } = req.body;

    // 🔥 STEP 1: Fetch invoice + relations
    const invoice = await Invoice.findByPk(invoice_id, {
      include: [
        {
          model: Lead,
          attributes: ["id", "customer_name"],
          include: [
            {
              model: Customer,
              attributes: ["email"]
            }
          ]
        }
      ]
    });

    if (!invoice) {
      
      return errorResponse(res, "Invoice not found", null, 404);
    }

    // 🔥 STEP 2: Customer info
    const customerName = invoice?.Lead?.customer_name || "Customer";
    const customerEmail = invoice?.Lead?.Customer?.email;

    // 🔥 STEP 3: Save payment (ONLY ONCE ✅)
    await Payment.create({
      invoice_id,
      amount,
      payment_mode,
      payment_date: new Date(),
      notes
    });

    // 🔥 STEP 4: Recalculate totals
    const payments = await Payment.findAll({
      where: { invoice_id }
    });

    const totalPaid = payments.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    const totalAmount = parseFloat(invoice.total_amount);
    const dueAmount = totalAmount - totalPaid;
    const finalDue = Math.max(0, parseFloat(dueAmount.toFixed(2)));

    let status = "pending";
    if (totalPaid > 0 && finalDue > 0) status = "partial";
    if (finalDue === 0) status = "paid";

    // 🔥 STEP 5: Update invoice
    await Invoice.update(
      {
        paid_amount: totalPaid,
        due_amount: finalDue,
        status
      },
      { where: { id: invoice_id } }
    );

    // 🔥 STEP 6: Generate PDF
    const filePath = `uploads/invoice_${Date.now()}.pdf`;

    generateInvoice(
      {
        customer: customerName,
        amount,
        payment_id: "PAY123"
      },
      filePath
    );

    // 🔥 STEP 7: Send Email
    if (customerEmail) {
      await sendInvoiceEmail(
        customerEmail,
        "Invoice Payment",
        "Please find your invoice attached",
        filePath
      );
    }

    return successResponse(res, { paid_amount: totalPaid,
      due_amount: finalDue,
      status }, "Payment added & invoice sent");

  } catch (err) {
    console.error("Payment Error:", err);
    return errorResponse(res, "Payment failed", err.message);
  }
};


  // GET ALL INVOICES

  const { Op } = require("sequelize");

exports.getInvoices = async (req, res) => {
  try {
    const { lead_id, status, min_amount, max_amount } = req.query;

    let where = {};

    if (lead_id) where.lead_id = lead_id;
    if (status) where.status = status;

    if (min_amount || max_amount) {
      where.total_amount = {};
      if (min_amount) where.total_amount[Op.gte] = min_amount;
      if (max_amount) where.total_amount[Op.lte] = max_amount;
    }

    const data = await Invoice.findAll({
      where,
      order: [["id", "DESC"]]
    });

    
    return successResponse(res, {data }, "Fetch Data successful");

  } catch (err) {
    return errorResponse(res, "Fetch data failed", err.message);
  }
};

// GET PAYMENTS BY INVOICE

exports.getPayments = async (req, res) => {
    const data = await Payment.findAll({
      where: { invoice_id: req.params.invoice_id }
    });
  
    return successResponse(res, {data }, "Fetch Data successful");
  };

  // DELETE INVOICE

  exports.deleteInvoice = async (req, res) => {
    await Invoice.destroy({
      where: { id: req.params.id }
    });
    return successResponse(res,  "Delete  successful");
    
  };


  // Delete Payment and update Invoice

  exports.deletePayment = async (req, res) => {
    try {
      const paymentId = req.params.id;
  
      // ✅ Get payment first
      const payment = await Payment.findByPk(paymentId);
  
      if (!payment) {
        return errorResponse(res, "Payment not found", null, 404);
      }
  
      const invoice_id = payment.invoice_id;
  
      // ✅ Delete payment
      await Payment.destroy({
        where: { id: paymentId }
      });
  
      // ✅ Recalculate total payment
      const payments = await Payment.findAll({
        where: { invoice_id }
      });
  
      const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
      const invoice = await Invoice.findByPk(invoice_id);
      const totalAmount = parseFloat(invoice.total_amount);
  
      const dueAmount = totalAmount - totalPaid;
      const finalDue = Math.max(0, parseFloat(dueAmount.toFixed(2)));
  
      let status = "pending";
      if (totalPaid > 0 && finalDue > 0) status = "partial";
      if (finalDue === 0) status = "paid";
  
      // ✅ Update invoice
      await Invoice.update(
        {
          paid_amount: totalPaid,
          due_amount: finalDue,
          status
        },
        { where: { id: invoice_id } }
      );
  
      return successResponse(res, {paid_amount: totalPaid,
        due_amount: finalDue,
        status }, "Payment deleted successfully");
  
    } catch (err) {
      console.error("Delete Payment Error:", err);
      return errorResponse(res, "Delete Payment failed", err.message);
    }
  };
