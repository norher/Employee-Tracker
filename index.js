const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const allEmployees = [];
const allDepartments = [];
const allRoles = [];

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

const getDepartments = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) {
            console.log(err);
        }
        for (let department of results) {
            allDepartments.push(department.name)
        }
    })
};

const getRoles = () => {
    db.query(`SELECT * FROM role`, (err, results) => {
        if (err) {
            console.log(err);
        }
        for (let role of results) {
            allRoles.push(role.title)
        }
    })
};

const getEmployees = () => {
    db.query(`SELECT * FROM employee`, (err, results) => {
        if (err) {
            console.log(err);
        }
        for (let employee of results) {
            allEmployees.push(employee.first_name + employee.last_name)
        }
    })
};
  
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
                console.log("Thank you! Goodbye!");
                db.end();
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
        var query = `INSERT INTO department set ?`;
        db.query(query, {
            name: res.newDept,
        }, function (err, res) {
            if (err) throw err;
            console.log("Department Added!");
            console.table(res);
            mainMenu();
        })
    })
};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What Role would you like to add?',
            name: 'newRole',
        },
        {
            type: 'input',
            message: 'What is the salary of this role?',
            name: 'newSalary',
        },
        {
            type: 'input',
            message: 'Given the department IDs 1=Admin, 2=Teaching, 3=Counseling, 4=Maintenance, 5=Flying, to which department id, does this role belong to',
            name: 'dept',
        },
    ])
    .then((res) => {
        var query = "INSERT INTO role SET ?";
        db.query(query, {
            title: res.newRole,
            salary: parseFloat(res.newSalary),
            department_id: parseFloat(res.dept)
        }, function (err, res) {
            if (err) throw err;
            viewRoles();
        })
    })
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of this employee?',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'What is the last name of this employee?',
            name: 'last_name',
        },
        {
            type: 'input',
            message: 'What is the roleID of this employee?',
            name: 'role_id',
        },
    ])
    .then((res) => {
        var query = "INSERT INTO employee SET ?"
        db.query(query, {
            first_name: res.first_name,
            last_name: res.last_name,
            role_id: parseInt(res.role_id),
        }, function (err, res) {
            if (err) throw err;
            viewEmployees();
        })
    })
};

function updateEmployee() {
    let queryEmployee = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;

    db.query(queryEmployee, function (err, res) {
        if (err) throw err;
        console.table("Enter the ID of the employee that you would like to update:", res);
    });

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter the ID of the employee that you would like to update:",
        }, {
            name: "column",
            type: "rawlist",
            message: "What would you like to change about this employee?",
            choices: [
                "role",
                "manager",
            ]
        }])
        .then((answers) => {
            const column = answers.column;
            const employeeID = answers.id;

            switch (column) {
                case "role":
                    db.query("SELECT * from role;", function (err, res) {
                        if (err) throw err;
                        console.table("Select the ID of the role that you would like to assign the employee to:", res);
                    });
                    break;
                case "manager":
                    db.query(queryEmployee, function (err, res) {
                        if (err) throw err;
                        console.table("Select the ID of the manager that you would like to assign the employee to:", res);
                    });
                    break;
            }

            inquirer
                .prompt([{
                    name: "id",
                    type: "input",
                    message: "Enter the ID of the " + column + " that you would like to assign the employee to:",
                }]).then((answers) => {
                    let Update;

                    if (answers.id === "") {
                        Update = "UPDATE employee SET " + column + "_id = null";
                    } else {
                        Update = "UPDATE employee SET " + column + "_id = " + parseInt(answers.id);
                    }

                    Update += " WHERE id = " + employeeID;

                    db.query(Update, function (err, res) {
                        if (err) throw err;
                    });

                    db.query(queryEmployee, function (err, res) {
                        if (err) throw err;
                        console.table("Employees", res);
                        viewEmployees();
                    });
                });
        });
}

function init() {
    getDepartments();
    getEmployees();
    getRoles();
    mainMenu();
}