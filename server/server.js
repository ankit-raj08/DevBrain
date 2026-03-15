require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PATCH", "PUT"], allowedHeaders: ["Content-Type"] }));
app.use(express.json());

connectDB();

app.use("/api/errors",    require("./routes/errorRoutes"));
app.use("/api/ai",        require("./routes/aiRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/", (req, res) => res.send("DevBrain API Running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
