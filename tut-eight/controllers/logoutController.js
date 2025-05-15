const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const handleSignOutAndClearCookie = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  // Get existing token
  const refreshToken = cookies.jwt;

  // Check exisiting user
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204); // No content
  }
  try {
    // Clear user
    const otherUser = usersDB.users.filter(
      (person) => person.refreshToken !== foundUser.refreshToken
    );
    const activeUser = { ...foundUser, refreshToken: "" };
    usersDB.setUsers([...otherUser, activeUser]);

    // Write to our simulated DB
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204); // No content
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = handleSignOutAndClearCookie;
