const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.userId = null;
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;
    req.user = decoded;

    next();

  } catch (error) {
    res.clearCookie("token");
    req.userId = null;
    req.user = null;

    next();
  }
}

module.exports = optionalAuth;