const path = require("path");
const express = require("express");
const session = require("express-session");
const connectDB = require("./config/database");
const indexRoutes = require("./routes");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3007;

// Connect to MongoDB (non-blocking)
connectDB().catch((err) => {
  console.error("Failed to connect to MongoDB on startup:", err.message);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration for cart
app.use(
  session({
    secret: "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize cart in session if not exists
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.use("/", indexRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    message: "The page you are looking for does not exist.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
