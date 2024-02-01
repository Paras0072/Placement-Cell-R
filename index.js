const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

// require ('dotenv').config();
const port = 8000;
const db = require("./config/mongoose");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// used for sessions
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const customWareFlash = require("./config/middleware");
const MongoStore = require("connect-mongo");

app.use(cookieParser());
app.use(express.static("./assets"));
// setup express layouts
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo-store is used to store session cookies in database
app.use(
  session({
    name: "placement-cell",
    secret: "asewe",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://Placementcell:Placement@cluster0.uobdejz.mongodb.net/",
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// sets the authenticated user in the response
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customWareFlash.setFlash);
// using express routers
app.use(require("./routes"));

// using bodyParser
app.use(bodyParser.json());

// listening to the port 8000;
app.listen(port, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log("server is succesfully running on port 8000");
});
