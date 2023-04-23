const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { app, db, PORT }= require('./server.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const viewAll = function () {
    app.get('/employees', async (req, res) => {
        const conn = await mysql.createConnection(db);
        const [rows] = await conn.query('SELECT * FROM employees');
        await conn.end();
        res.json(rows);
    });
};

const viewAllDep = function () {
    app.get('/employees/by-department', async (req, res) => {
        const conn = await mysql.createConnection(db);
        const [rows] = await conn.query(`
        SELECT employees.*, departments.name as department_name 
        FROM employees 
        INNER JOIN roles ON employees.role_id = roles.id 
        INNER JOIN departments ON roles.department_id = departments.id 
        ORDER BY departments.name, employees.last_name, employees.first_name
      `);
        await conn.end();
        res.json(rows);
    });
};

const viewByMan = function () {
    app.get('/employees/by-manager', async (req, res) => {

        const conn = await mysql.createConnection(db);
        const [rows] = await conn.query(`
            SELECT employees.*, CONCAT(managers.first_name, ' ', managers.last_name) as manager_name 
            FROM employees 
            INNER JOIN employees managers ON employees.manager_id = managers.id 
            ORDER BY manager_name, employees.last_name, employees.first_name
          `);
        await conn.end();
        res.json(rows);
    });
};


const addEm = function () {
    app.post('/employees', async (req, res) => {
        const { first_name, last_name, role_id, manager_id } = req.body;
        if (!first_name || !last_name || !role_id) {
            res.status(400).send('Invalid request body');
            return;
        }
        const conn = await mysql.createConnection(db);
        await conn.execute(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [first_name, last_name, role_id, manager_id]
        );
        await conn.end();
        res.sendStatus(201);
    });
}

const updateEm = function () {
    app.put('/employees/:id/role', async (req, res) => {
        const { role_id } = req.body;
        const { id } = req.params;
        if (!role_id) {
            res.status(400).send('Invalid request body');
            return;
        }
        const conn = await mysql.createConnection(db);
        await conn.execute(
            'UPDATE employees SET role_id = ? WHERE id = ?',
            [role_id, id]
        );
        await conn.end();
    });
};

const userInput =
{
    type: "list",
    name: "action",
    message: "What do you want to do?",
    choices: ["View Employees", "View Employees by Department", "View Employees by Manager", "Add Employee", "Update Employee"]
}

inquirer.prompt(userInput).then(answers=>{ 
    if(answers.action === "View Employees"){
        viewAll();
    } else if(answers.action === "View Employees by Department"){
        viewAllDep();
    } else if(answers.action === "View Employees by Manager"){
        viewByMan();
    } else if(answers.action === "Add Employee"){
        addEm();
    } else if(answers.action === "Update Employee"){
        updateEm();
    };
});