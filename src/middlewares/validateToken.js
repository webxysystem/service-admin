import jwt from "jsonwebtoken";

const SECRET = "webxy-admin-system";
const secret = process.env.TOKEN_KEY || SECRET;

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.body.refresh_token ||
      req.query.token ||
      req.body.tempToken ||
      req.headers["x-access-token"];

    if (!token)
      return res.status(403).send("A token is required for authentication");
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.id;
      if (decoded.managerId) {
        req.managerId = decoded.managerId;
      }
    } catch (err) {
      console.log(err);
      return res.status(401).send("Invalid Token");
    }

    return next();
  } catch (e) {
    console.error(e);
  }
};

module.exports = verifyToken;
