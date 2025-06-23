import { decodeUserType, AuthenticatedRequest } from "@/types/express";
import { ApiError } from "@/utils/apiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { env } from "@/validators/env";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let { refreshToken } = req.cookies;

    if (!refreshToken) {
      refreshToken = req.headers.authorization?.split(" ")[1];
    }

    if (!refreshToken) {
      return next(new ApiError(403, "No refresh token provided"));
    }

    const { id } = jwt.verify(refreshToken, env.REFRESHTOKEN) as decodeUserType;

    req.user = { id };

    next();
  }
);
