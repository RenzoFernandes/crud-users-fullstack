const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    message: "API CRUD Users is running",
  });
});

app.use(userRoutes);

module.exports = app;