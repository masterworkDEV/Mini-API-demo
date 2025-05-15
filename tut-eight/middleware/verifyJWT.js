const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN,

    (err, decoded) => {
      if (err) return res.sendStatus(403); //FORBIDDEN
      req.user = decoded.userInfo.username;
      req.roles = decoded.userInfo.role;
      next();
    }
  );
};

module.exports = verifyToken;
