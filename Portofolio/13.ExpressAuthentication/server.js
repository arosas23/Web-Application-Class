require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Passport & sessions
const session = require("express-session");
const passport = require("passport");
const passportLocalMongooseModule = require("passport-local-mongoose");
const passportLocalMongoose = passportLocalMongooseModule.default || passportLocalMongooseModule;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

// Conection MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

// Passport local
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ googleId: profile.id })
      .then(user => {
        if (user) return cb(null, user);

        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName
        });

        newUser.save().then(() => cb(null, newUser));
      });
  }
));

// Routes

// Home page (login + registration link)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

// Render register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Render login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Protected secret page
app.get("/secret", (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("secrets", { user: req.user });
  }
  res.redirect("/");
});

// Register
app.post("/register", (req, res) => {
  (async () => {
    try {
      console.log("Register attempt for username:", req.body.username);
      const user = await User.register({ username: req.body.username, email: req.body.email }, req.body.password);
      console.log("User registered:", user.username);
      req.login(user, (err) => {
        if (err) {
          console.error("Login session error during register:", err);
          return res.redirect("/");
        }
        console.log("Session created for:", user.username);
        return res.redirect("/secret");
      });
    } catch (err) {
      console.error("Registration error:", err.message);
      return res.redirect("/");
    }
  })();
});

// Login
app.post("/login", (req, res) => {
  (async () => {
    try {
      console.log("Login attempt for username:", req.body.username);
      const user = await User.findByUsername(req.body.username, true);
      if (!user) {
        console.log("User not found:", req.body.username);
        return res.redirect("/");
      }
      const { user: authUser, error } = await user.authenticate(req.body.password);
      if (!authUser) {
        console.log("Authentication failed for:", req.body.username, error);
        return res.redirect("/");
      }
      req.login(authUser, (err) => {
        if (err) {
          console.error("Login session error:", err);
          return res.redirect("/");
        }
        // Set authentication cookie
        res.cookie("authUser", authUser.username, { maxAge: 3600000, httpOnly: true });
        console.log("Login successful for user:", authUser.username, "- Cookie set");
        return res.redirect("/secret");
      });
    } catch (err) {
      console.error("Login error:", err.message);
      return res.redirect("/");
    }
  })();
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

app.post("/logout", (req, res) => {
  req.logout(() => {
    // Clear authentication cookie
    res.clearCookie("authUser");
    console.log("Logout successful - Cookie cleared");
    res.redirect("/");
  });
});

// Google Auth
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("Google auth successful for user:", req.user.username);
    res.redirect("/secret");
  }
);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
