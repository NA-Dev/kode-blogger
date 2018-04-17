const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require("connect-flash");
const PORT = process.env.PORT || 3001;
const app = express();
const db = require("./models");
const apiController = require("./controllers/api_controller");
const loginController = require("./controllers/login_controller");
const userController = require("./controllers/user_controller");
const noteController = require("./controllers/note_controller");
const postController = require('./controllers/post_controller');

//Setup passport
const passport = require('passport');
require('./config/passport')(passport); // pass passport for configuration

// Serve up static assets
app.use(express.static("client/build"));
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const myStore = new SequelizeStore({db: db.sequelize});

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store: myStore 
}));

db.users.sync();
db.notes.sync();
db.posts.sync();
myStore.sync();

// Use Controllers
app.use("/api", apiController);
app.use(noteController);
app.use(postController);

//Persistent login sessions (maybe?)
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./controllers/user_controller')(app, passport);
require('./controllers/login_controller')(app, passport);


// Send all other requests to the React app
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});