const express = require("express");

const {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const validateUser = require("../middlewares/validateUser");

const router = express.Router();

router.get("/users", listUsers);

router.get("/users/:id", getUserById);

router.post("/users", validateUser, createUser);

router.put("/users/:id", validateUser, updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;