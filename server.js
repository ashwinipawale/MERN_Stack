const express = require("express");
const app = express();
const connectDB = require("./config/db");

const userRoute = require("./routes/api/users");
const authRoute = require("./routes/api/auth");
const profileRoute = require("./routes/api/profile");
const postsRoute = require("./routes/api/posts");

//Connect Database
connectDB();

//INIT Middleware
app.use(express.json({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, x-auth-token, Content-Type, Accept"
  );
  next();
});

//Define Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);

// Server static assets in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is listening on PORT ${PORT}`));
