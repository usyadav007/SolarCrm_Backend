const express =
  require("express");

const router =
  express.Router();

const controller =
  require("../controllers/billingController"); // ✅ Correct Path

router.post(
  "/invoice",
  controller.create
);

router.get(
  "/invoice",
  controller.getAll
);

router.get(
  "/invoice/:id",
  controller.getOne
);

router.put(
  "/invoice/:id",
  controller.update
);

router.delete(
  "/invoice/:id",
  controller.delete
);

module.exports =
  router;