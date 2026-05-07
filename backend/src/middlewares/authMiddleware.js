const jwt = require("jsonwebtoken");

const authMiddleware = (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({
        error: "Token not provided",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (error, decoded) => {
        if (error) {
          return response.status(401).json({
            error: "Invalid token",
          });
        }

        request.user = decoded;

        next();
      }
    );
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = authMiddleware;