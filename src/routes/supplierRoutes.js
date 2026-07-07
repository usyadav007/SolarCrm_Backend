const router = require("express").Router();

const supplierController =
require("../controllers/supplierController");

router.post(
  "/",
  supplierController.create
);

router.get(
  "/",
  supplierController.getAll
);

router.get(
  "/:id",
  supplierController.getOne
);

router.put(
  "/:id",
  supplierController.update
);

router.delete(
  "/:id",
  supplierController.delete
);

module.exports = router;