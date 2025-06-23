export const options = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
};
