// We are returning a middleware function inside this function. Also using the "rest operator", similar to the "spread operator" this paramenter allows us to pass as many args as we want in function.
const handleUserRoles = (...availableRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const userRoles = [...availableRoles];
    const result = req.roles
      .map((role) => userRoles.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401); // Unauthorized
    next();
  };
};

module.exports = handleUserRoles;
