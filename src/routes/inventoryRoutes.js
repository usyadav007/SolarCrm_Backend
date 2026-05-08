const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryController");
const auth = require("../middleware/authMiddleware");

router.post("/product", auth, controller.addProduct);
router.post("/stock-in", auth, controller.addStock);
router.post("/stock-out", auth, controller.useStock);
router.get("/stock", auth, controller.getStock);
// Product
router.put("/product/:id", auth, controller.updateProduct);
router.delete("/product/:id", auth, controller.deleteProduct);

// Stock
router.delete("/stock/:id", auth, controller.deleteStock);

// History
router.get("/history", auth, controller.getHistory);

module.exports = router;