const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../config/database");

const listUsers = async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    response.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

const createUser = async (request, response) => {
  try {
    const { name, email, phone, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
        INSERT INTO users (name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, phone, created_at
      `,
      [name, email, phone, hashedPassword]
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    const result = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return response.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return response.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    response.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

const getUserById = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        error: "User not found",
      });
    }

    response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateUser = async (request, response) => {
  try {
    const { id } = request.params;

    const { name, email, phone } = request.body;

    const result = await pool.query(
      `
        UPDATE users
        SET
          name = $1,
          email = $2,
          phone = $3
        WHERE id = $4
        RETURNING *
      `,
      [name, email, phone, id]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        error: "User not found",
      });
    }

    response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    const result = await pool.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        error: "User not found",
      });
    }

    response.status(200).json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  listUsers,
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
};