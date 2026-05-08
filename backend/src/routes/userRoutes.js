const express = require("express");

const {
  listUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const validateUser = require("../middlewares/validateUser");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, listUsers);

router.get("/users/:id", authMiddleware, getUserById);

router.post("/users", validateUser, createUser);

router.post("/login", loginUser);

router.put("/users/:id", authMiddleware, validateUser, updateUser);

router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;