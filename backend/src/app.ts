import express, { Express } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import session from "express-session";
import passport from "passport";
import "@/utils/passport";
import { env } from "./validators/env";
import cookieParser from "cookie-parser";
const app: Express = express();

app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.status(200).json("It is up and running...");
});
app.use(express.urlencoded({ extended: true }));

import authRoute from "./routes/auth.route";

app.use("/api/auth", authRoute);

app.get("/login", (req, res) => {
  res.send('<a href="/api/auth/google">Login with Google</a>');
});

app.use(errorHandler);

export default app;
