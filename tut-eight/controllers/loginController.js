// Get our temporary DB
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
// imported modules
const fsPromises = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(400)
      .json({ message: `Username and password are required!` });

  // Check if existing user..
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(403); //Unauthorized
  try {
    // check password if it matches with the current users password.
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // get current user role
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            role: roles,
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "40s" }
      );
      const refreshToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            role: roles,
          },
        },
        process.env.REFRESH_TOKEN,
        { expiresIn: "1d" }
      );

      // saving token to storage
      const otherUsers = usersDB.users.filter(
        (person) => person.username !== foundUser.username
      );
      const currentUser = { ...foundUser, refreshToken };
      usersDB.setUsers([...otherUsers, currentUser]);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.send({ accessToken });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = handleLogin;
