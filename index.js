const inquirer = require('inquirer');
const cTable = require('console.table');
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
            "Exit",
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
            case "Exit":
                shutDown();
                break;
        }
    });
};

const viewDepts = () =>
    db.query(`
    SELECT department.id AS ID, department.name AS Department FROM department;
    `, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.table(results)
        }
        mainMenu();
    }
);

const viewRoles = () =>
    db.query(`
    SELECT role.id, role.title, department.name AS Department
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY role.id;
    `, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.table(results)
        }
        mainMenu();
    }
);

const viewEmployees = () =>
    db.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id;
    `, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.table(results)
        }
        mainMenu();
    }
);

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What department would you like to add',
            name: 'newDept',
        },
    ])
    .then((res) => {
        db.query("INSERT INTO department (department_name) VALUES (?)",
        res.newDept,
        (err, results => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Department ${res.newDept} has been successfully added!`);
            }
            mainMenu();
        })
        )
    })
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What Role would you like to add',
            name: 'newRole',
        },
    ])
    .then((res) => {
        db.query("INSERT INTO role (role_name) VALUES (?)",
        res.newRole,
        (err, results => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Role ${res.newRole} has been successfully added!`);
            }
            mainMenu();
        })
        )
    })
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What Employee would you like to add',
            name: 'newEmployee',
        },
    ])
    .then((res) => {
        db.query("INSERT INTO Employee (Employee_name) VALUES (?)",
        res.newEmployee,
        (err, results => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Employee ${res.newEmployee} has been successfully added!`);
            }
            mainMenu();
        })
        )
    })
};

function init() {
    mainMenu();
}