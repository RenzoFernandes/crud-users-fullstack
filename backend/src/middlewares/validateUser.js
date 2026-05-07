const pool = require("../config/database");

const validateUser = async (request, response, next) => {
  try {
    const { name, email, phone } = request.body;

    // NAME REQUIRED
    if (!name || name.trim() === "") {
      return response.status(400).json({
        error: "Name is required",
      });
    }

    // NAME MIN LENGTH
    if (name.trim().length < 3) {
      return response.status(400).json({
        error: "Name must have at least 3 characters",
      });
    }

    // EMAIL REQUIRED
    if (!email || email.trim() === "") {
      return response.status(400).json({
        error: "Email is required",
      });
    }

    // EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return response.status(400).json({
        error: "Invalid email format",
      });
    }

    // PHONE REQUIRED
    if (!phone || phone.trim() === "") {
      return response.status(400).json({
        error: "Phone is required",
      });
    }

    // PHONE ONLY NUMBERS
    const phoneRegex = /^\d+$/;

    if (!phoneRegex.test(phone)) {
      return response.status(400).json({
        error: "Phone must contain only numbers",
      });
    }

    // PHONE MIN LENGTH
    if (phone.length < 8) {
      return response.status(400).json({
        error: "Phone must have at least 8 digits",
      });
    }

    // EMAIL DUPLICATE CHECK
    const userExists = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
      `,
      [email]
    );

    const userId = request.params.id;

    if (
      userExists.rows.length > 0 &&
      userExists.rows[0].id !== Number(userId)
    ) {
      return response.status(400).json({
        error: "Email already exists",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = validateUser;