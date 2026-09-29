const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/users");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
 async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if Google user already exists
        let user = await User.findOne({
          googleId: profile.id,
        });
        // If user exists, log them in
        if (user) {
          return done(null, user);
        }
        // If user doesn't exist, create them
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
        });
        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
));