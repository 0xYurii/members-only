import express from "express";
import session from "express-session";
import { join, dirname } from "node:path";
import { fileURLToPath } from "url";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats", // Change this to a random string in production
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from public directory
app.use(express.static(join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
