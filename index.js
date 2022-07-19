const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "..",
    database: 'employee_db'
}, console.log(`Connected to database.`));

db.connect(function (err) {
    if (err) throw err;
    init();
});

const mainMenu = () => {
    inquirer.prompt({
        type: 'list',
        name: 'Menu',
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee",
        ],
    })
    .then(function (data) {
        switch (data.Menu) {
            case "View all departments":
                viewDepts();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case  "Add an employee":
                addEmployee();
                break;
            case "Update an employee":
                updateEmployee();
                break;
            default: console.log("Please Try Again");
        }
    });
};