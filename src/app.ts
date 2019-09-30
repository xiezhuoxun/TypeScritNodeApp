import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import * as mongodb from "./db/mongodb";

const MongoStore = mongo(session);

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";


// API keys and Passport configuration
import * as Utils from "./util";

// Create Express server
const app = express();

mongodb.connect();

// Connect to MongoDB
// const mongoUrl = MONGODB_URI;
// mongoose.Promise = bluebird;

// mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
//     () => { 
//         /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
//         console.log("数据库连接成功!");
//     },
// ).catch(err => {
//     console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
//     // process.exit();
// });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: MONGODB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use(function (req, res, next) {
	if (req.method !== "POST") {
		Utils.send2Client(res, 200, Utils.StatusCode.NO_POST);
		return;
	}
	if (req.url !== "/") {
		Utils.send2Client(res, 200, Utils.StatusCode.NO_URL);
		return;
	}
	next();
});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", homeController.index);


export default app;
