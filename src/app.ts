import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import flash from "express-flash";
import path from "path";
import passport from "passport";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import * as mongodb from "./db/mongodb";
import routes from "./routes/index";
import * as Utils from "./util";
const MongoStore = mongo(session);
const app = express();

// Controllers (route handlers)
// import * as homeController from "./controllers/home";
// import * as userController from "./controllers/user";
// import * as apiController from "./controllers/api";
// import * as contactController from "./controllers/contact";

// Create Express server

mongodb.connect();

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

routes(app);

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

// app.get("/", homeController.index);


export default app;
