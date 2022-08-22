const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    res.locals.user = req.user;
    res.locals.authenticated = !req.user.anonymous;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
