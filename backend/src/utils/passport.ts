import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "@/validators/env";
import { db } from "@/db";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await db.user.findFirst({
          where: { email: profile.emails?.[0]?.value },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await db.user.create({
          data: {
            email: profile.emails?.[0]?.value || "",
            fullName: profile.displayName,
            isVerified: true,
            avatar: profile.photos?.[0]?.value || null,
            password: profile.id,
          },
        });

        done(null, newUser);
      } catch (err) {
        done(err, null as any);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
