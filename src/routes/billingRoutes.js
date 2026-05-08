const express = require("express");
const router = express.Router();

const controller = require("../controllers/billingController");
const auth = require("../middleware/authMiddleware");

router.post("/invoice", auth, controller.createInvoice);
router.get("/invoice", auth, controller.getInvoices);
router.delete("/invoice/:id", auth, controller.deleteInvoice);

router.post("/payment", auth, controller.addPayment);
router.get("/payment/:invoice_id", auth, controller.getPayments);
router.delete("/payment/:id", auth, controller.deletePayment);

module.exports = router;