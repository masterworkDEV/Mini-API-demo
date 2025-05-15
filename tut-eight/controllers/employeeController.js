const data = {
  employees: require("../model/employee.json"),
  setEmployees: (data) => (this.employees = data),
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  if (!newEmployee.firstName && !newEmployee.lastName) {
    return res
      .status(400)
      .json({ " message": "Firstname and Lastname are required" });
  }
  // after creating new employees we then make a copy of our existing array adding the "new employee data" to the existing one.
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  const employee = data.employees.find(
    (employee) => employee.id === parseInt(req.body.id)
  );
  if (!employee) {
    return res
      .status(400)
      .json({ " message": `Employee with the id ${req.body.id} not found` });
  }
  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lasttName = req.body.lastName;

  const filteredEmployee = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  const unsortedArray = [...filteredEmployee, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    res
      .status(400)
      .json({ message: `Employee with the ID ${req.body.id} not found.` });
  }
  const filteredEmployee = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredEmployee]);
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  if (!employee) {
    res
      .status(400)
      .json({ message: `Employee with the ID ${req.body.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
