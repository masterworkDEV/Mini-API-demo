const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const verifyRoles = require("../middleware/verifyRoles");
const ROLE_LIST = require("../logs/roles_list");

router
  .route("/")
  .get(
    verifyRoles(ROLE_LIST.User, ROLE_LIST.Editor, ROLE_LIST.Admin),
    employeeController.getAllEmployees
  )
  .post(
    verifyRoles(ROLE_LIST.Editor, ROLE_LIST.Admin),
    employeeController.createEmployee
  )
  .put(
    verifyRoles(ROLE_LIST.Editor, ROLE_LIST.Admin),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLE_LIST.Admin), employeeController.deleteEmployee);

// get employee by ids
router.route("/:id").get(employeeController.getEmployee);

module.exports = router;
