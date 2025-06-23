import jwt, { SignOptions } from "jsonwebtoken";
import { ApiError } from "./apiError";
import { env } from "@/validators/env";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessTokenAndRefreshToken = (
  userId: string
): TokenPair => {
  try {
    const accessSecret = env.ACCESSTOKEN;
    const refreshSecret = env.REFRESHTOKEN;
    const accessExpire = env.ACCESSTOKEN_EXPIRE;
    const refreshExpire = env.REFRESHTOKEN_EXPIRE;

    if (!accessSecret || !refreshSecret || !accessExpire || !refreshExpire) {
      throw new ApiError(500, "Token environment variables are not defined");
    }

    const accessToken = jwt.sign({ id: userId }, accessSecret, {
      expiresIn: accessExpire,
    } as SignOptions);

    const refreshToken = jwt.sign({ id: userId }, refreshSecret, {
      expiresIn: refreshExpire,
    } as SignOptions);

    return { accessToken, refreshToken };
  } catch (error: any) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens",
      error
    );
  }
};
