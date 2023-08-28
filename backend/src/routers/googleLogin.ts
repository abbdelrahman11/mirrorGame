import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const passport = require("passport");
router.get("/login/success", (req: any, res) => {
  const jwtSecret = process.env.JWT_SECRET || "default_secret";
  if (req.user) {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.emails[0].value,
      },
      jwtSecret,
      {
        expiresIn: "30d",
      }
    );
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
      token: token,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req: any, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL as any);
});

export default router;
