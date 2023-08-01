import Logout from "../controllers/logout.controller"
import express from "express";
export const logoutRouter = express.Router();
logoutRouter.get('/logout',Logout.getLogout)