const express = require("express");

const router = express.Router();

const controller = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

// AUTH

router.post("/register", controller.register);

router.post("/login", controller.login);

// USER MANAGEMENT

router.get("/users", auth, controller.getUsers);

router.get("/users/:id", auth, controller.getUserById);

router.put("/users/:id", auth, controller.updateUser);

router.delete("/users/:id", auth, controller.deleteUser);

module.exports = router;