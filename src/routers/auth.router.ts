import passport from "../middlewares/auth.middleware";
import express from "express";
import AuthController from "../controllers/auth.controller";
import { MainController } from "../controllers/main.controller";
import UserController from "../controllers/user.controller";
export const authRouter = express.Router();
authRouter.get("/login", AuthController.getFormLogin);
authRouter.get("/index", MainController.showHomePage);
authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login",
    failureMessage: "Invalid username or password",
  })
);
authRouter.get("/", (req, res) => {
  res.redirect("/index");
});
authRouter.get("/user", UserController.displayUserPage);
authRouter.get("/user/edit", UserController.displayUserEditPage);
authRouter.post("/user/edit", UserController.updateUserInfo);
authRouter.get("/rental/delete/:id", UserController.removeBill);
authRouter.get("/register", AuthController.getFormRegister);
authRouter.post("/register", AuthController.register);
// authRouter.post('/auth/login', passport.authenticate('local', { session: true, failureRedirect: '/auth/login' }), MainController.showHomePage);
authRouter.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/index");
  }
);