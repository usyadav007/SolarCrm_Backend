const express =
  require("express");

const router =
  express.Router();

const controller =
  require("../controllers/inventoryCategoryController");


// CREATE

router.post(
  "/",
  controller.create
);


// GET ALL

router.get(
  "/",
  controller.getAll
);


// GET ONE

router.get(
  "/:id",
  controller.getOne
);


// UPDATE

router.put(
  "/:id",
  controller.update
);


// DELETE

router.delete(
  "/:id",
  controller.delete
);


module.exports =
  router;