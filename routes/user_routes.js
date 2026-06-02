import { Router } from "express";
import {
 
  getAllUsers,
  userLogin,
  userLogout,
  userSignup,
  verifyUser,
  forgetPassword
} from "../controllers/user_controller.js";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token_manager.js";

const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth_status", verifyToken, verifyUser);
userRoutes.post("/forget_password",forgetPassword);
userRoutes.get("/logout", verifyToken, userLogout);


export default userRoutes;
