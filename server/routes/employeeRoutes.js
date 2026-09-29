const express = require("express");

const router = express.Router();

const { auth } = require("../middleware/authMiddleware");

const {
    addEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");


// Add Employee
router.post("/", auth, addEmployee);


// Get All Employees
router.get("/", auth, getEmployees);


// Get Employee By ID
router.get("/:id", auth, getEmployeeById);


// Update Employee
router.put("/:id", auth, updateEmployee);


// Delete Employee
router.delete("/:id", auth, deleteEmployee);


module.exports = router;