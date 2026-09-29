const db = require("../config/db");

// ==========================================
// ADD EMPLOYEE
// ==========================================
const addEmployee = (req, res) => {

    const {
        employee_id,
        name,
        email,
        mobile,
        department,
        designation,
        status
    } = req.body;

    // Basic validation
    if (
        !employee_id ||
        !name ||
        !email ||
        !mobile ||
        !department ||
        !designation ||
        !status
    ) {
        return res.status(400).json({
            message: "All employee fields are required"
        });
    }

    const sql = `
        INSERT INTO employees
        (employee_id, name, email, mobile, department, designation, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            name,
            email,
            mobile,
            department,
            designation,
            status
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to add employee",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Employee Added Successfully",
                id: result.insertId
            });
        }
    );
};


// ==========================================
// GET ALL EMPLOYEES
// ==========================================
const getEmployees = (req, res) => {

    const sql = "SELECT * FROM employees";

    db.query(sql, (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch employees",
                error: err.message
            });
        }

        res.json(result);
    });
};


// ==========================================
// GET EMPLOYEE BY ID
// ==========================================
const getEmployeeById = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to fetch employee",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.json(result[0]);
    });
};


// ==========================================
// UPDATE EMPLOYEE + AUDIT LOG
// ==========================================
const updateEmployee = (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        mobile,
        department,
        designation,
        status
    } = req.body;

    // Validation
    if (
        !name ||
        !email ||
        !mobile ||
        !department ||
        !designation ||
        !status
    ) {
        return res.status(400).json({
            message: "All employee fields are required"
        });
    }

    // First get the OLD employee data
    const getSql = `
        SELECT *
        FROM employees
        WHERE id = ?
    `;

    db.query(getSql, [id], (err, oldResult) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get employee data",
                error: err.message
            });
        }

        // Employee does not exist
        if (oldResult.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Save old employee data
        const oldEmployee = oldResult[0];

        // Update employee
        const updateSql = `
            UPDATE employees
            SET name = ?,
                email = ?,
                mobile = ?,
                department = ?,
                designation = ?,
                status = ?
            WHERE id = ?
        `;

        db.query(
            updateSql,
            [
                name,
                email,
                mobile,
                department,
                designation,
                status,
                id
            ],
            (updateErr, updateResult) => {

                if (updateErr) {
                    console.error(updateErr);

                    return res.status(500).json({
                        message: "Failed to update employee",
                        error: updateErr.message
                    });
                }

                // Check whether anything was actually updated
                if (updateResult.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Employee not found"
                    });
                }

                // ==========================================
                // INSERT AUDIT LOG
                // ==========================================

                const auditSql = `
                    INSERT INTO audit_logs
                    (
                        employee_id,
                        action,
                        previous_data,
                        action_by,
                        action_timestamp
                    )
                    VALUES (?, ?, ?, ?, NOW())
                `;

                const actionBy =
                    req.user && req.user.username
                        ? req.user.username
                        : "admin";

                db.query(
                    auditSql,
                    [
                        oldEmployee.employee_id,
                        "UPDATE",
                        JSON.stringify(oldEmployee),
                        actionBy
                    ],
                    (auditErr) => {

                        if (auditErr) {
                            console.error(
                                "Audit log error:",
                                auditErr
                            );

                            return res.status(500).json({
                                message: "Employee updated but audit log failed",
                                error: auditErr.message
                            });
                        }

                        res.json({
                            message: "Employee Updated Successfully"
                        });
                    }
                );
            }
        );
    });
};


// ==========================================
// DELETE EMPLOYEE + AUDIT LOG
// ==========================================
const deleteEmployee = (req, res) => {

    const id = req.params.id;

    // First get old employee data
    const getSql = `
        SELECT *
        FROM employees
        WHERE id = ?
    `;

    db.query(getSql, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to get employee data",
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Store old data before deleting
        const oldEmployee = result[0];

        // Delete employee
        const deleteSql = `
            DELETE FROM employees
            WHERE id = ?
        `;

        db.query(deleteSql, [id], (deleteErr, deleteResult) => {

            if (deleteErr) {
                console.error(deleteErr);

                return res.status(500).json({
                    message: "Failed to delete employee",
                    error: deleteErr.message
                });
            }

            // ==========================================
            // INSERT AUDIT LOG
            // ==========================================

            const auditSql = `
                INSERT INTO audit_logs
                (
                    employee_id,
                    action,
                    previous_data,
                    action_by,
                    action_timestamp
                )
                VALUES (?, ?, ?, ?, NOW())
            `;

            const actionBy =
                req.user && req.user.username
                    ? req.user.username
                    : "admin";

            db.query(
                auditSql,
                [
                    oldEmployee.employee_id,
                    "DELETE",
                    JSON.stringify(oldEmployee),
                    actionBy
                ],
                (auditErr) => {

                    if (auditErr) {
                        console.error(
                            "Audit log error:",
                            auditErr
                        );

                        return res.status(500).json({
                            message: "Employee deleted but audit log failed",
                            error: auditErr.message
                        });
                    }

                    res.json({
                        message: "Employee Deleted Successfully"
                    });
                }
            );
        });
    });
};


module.exports = {
    addEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};