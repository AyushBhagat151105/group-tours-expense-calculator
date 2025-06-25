import express from "express";
import passport from "passport";
import { generateAccessTokenAndRefreshToken } from "@/utils/jwtToken";
import { options } from "@/utils/cookiesOptions";
import { db } from "@/db";
import {
  getUserProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateUserProfile,
  verifyEmail,
} from "@/controllers/auth.controller";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { env } from "@/validators/env";
import { ApiResponse } from "@/utils/apiResponse";

const authRoute = express.Router();

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req: any, res) => {
    const user = req.user;

    if (!user) {
      return res.redirect("/login?error=OAuthFailed");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user.id);

    await db.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

    res.cookie("accessToken", accessToken, options);
    res.redirect(
      `${env.FRONTEND_URL}/GoogleSuccess?accessToken=${accessToken}`
    );

    // res.status(200).json(new ApiResponse(200, "Login successful", {}));
  }
);

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/verify-email/:token", verifyEmail);
authRoute.post("/logout", isAuthenticated, logout);
authRoute.put("/update-profile", isAuthenticated, updateUserProfile);
authRoute.get("/me", isAuthenticated, getUserProfile);
authRoute.post("/reset-password", isAuthenticated, resetPassword);
authRoute.post("/reset-password/:token", isAuthenticated, updatePassword);

export default authRoute;
