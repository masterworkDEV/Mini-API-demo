require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./logs/dbConn");
const credentials = require("./middleware/credentials");
const cors = require("cors");
const corsOptions = require("./middleware/cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const app = express();

// Connected to MongoDB
connectDB().catch(console.dir);

const PORT = process.env.PORT || 3500;

// ##### built in midddleware #####

// Handle option credentials check before CORS, and also fetch cookies requirement
app.use(credentials);

// Thirdparty middleware, CORS (Cross origin resource  sharing)
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// middleware for handling cookies
app.use(cookieParser());

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// server rour registerd router
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refresh"));

app.use(verifyJWT);
app.use("/employees", require("./routes/employees"));

// matches all file
// customizing our error block

app.all("*", (req, res) => {
  res.status(404);
  req.accepts("html")
    ? res.sendFile(path.join(__dirname, "views", "404.html"))
    : req.accepts("json")
    ? res.json({ error: "404 not found" })
    : res.type("txt").send("404 not found");
});

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`server started at ${PORT}`));
});
