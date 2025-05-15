const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // unauthorized
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //forbidden
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, decoded) => {
    if (error || decoded.username !== foundUser.username)
      return res.sendStatus(403); // invalid token

    //Regenerate new access token every 30s. But in a production app it would be longer

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30s" }
    );
    res.send({ accessToken });
  });
};

module.exports = handleRefreshToken;
