const pool = require("../config/database");

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

const validateUser = async (request, response, next) => {
  try {
    const { name, email, phone, password } = request.body;
    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);

    // NAME REQUIRED
    if (!normalizedName) {
      return response.status(400).json({
        error: "Name is required",
      });
    }

    // NAME MIN LENGTH
    if (normalizedName.length < 3) {
      return response.status(400).json({
        error: "Name must have at least 3 characters",
      });
    }

    // EMAIL REQUIRED
    if (!normalizedEmail) {
      return response.status(400).json({
        error: "Email is required",
      });
    }

    // EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return response.status(400).json({
        error: "Invalid email format",
      });
    }

    // PHONE REQUIRED
    if (!normalizedPhone) {
      return response.status(400).json({
        error: "Phone is required",
      });
    }

    // BRAZILIAN PHONE WITH DDD: 10 digits for landline, 11 for mobile
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return response.status(400).json({
        error: "Phone must have 10 or 11 digits",
      });
    }

    if (normalizedPhone.slice(0, 2) === "00") {
      return response.status(400).json({
        error: "Invalid phone area code",
      });
    }

    if (request.method === "POST") {
      if (!password || String(password).trim() === "") {
        return response.status(400).json({
          error: "Password is required",
        });
      }

      if (String(password).length < 6) {
        return response.status(400).json({
          error: "Password must have at least 6 characters",
        });
      }
    }

    request.body.name = normalizedName;
    request.body.email = normalizedEmail;
    request.body.phone = normalizedPhone;

    // EMAIL DUPLICATE CHECK
    const userExists = await pool.query(
      `
        SELECT * FROM users
        WHERE email = $1
      `,
      [normalizedEmail]
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
