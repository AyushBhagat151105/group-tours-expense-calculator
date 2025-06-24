import { decodeUserType, AuthenticatedRequest } from "@/types/express";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { env } from "@/validators/env";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.refreshToken;

    if (!token) {
      token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(403, "No token provided"));
    }

    try {
      const { id } = jwt.verify(token, env.ACCESSTOKEN) as decodeUserType;
      req.user = { id };
      next();
    } catch {
      return next(new ApiError(401, "Invalid or expired access token"));
    }
  }
);
