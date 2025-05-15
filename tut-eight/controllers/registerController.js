// Our temporary DB
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises; //file system
const path = require("path");
const bcrypt = require("bcrypt"); //bcypt

const createNewUser = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(404)
      .json({ message: "Username and password are required" });
  // if username already exist in the DB
  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate)
    return res
      .sendStatus(409)
      .json({ message: "This username already exist!" }); //conflict
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: user,
      roles: {
        User: 3113,
      },
      password: hashedPassword,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.status(201).json({ message: `New user  ${user} created!` });
  console.log(usersDB.users);
};

module.exports = { createNewUser };
