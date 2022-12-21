const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const { resolve } = require("path");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employeetracker_db",
});

const trackerQuestions = {
  type: "list",
  name: "employeeTracker",
  message: "What would you like to do?",
  choices: [
    "View all departments",
    "View all roles",
    "View all employees",
    "Add a department",
    "Add a role",
    "Add an employee",
    "Update an employee role",
  ],
};

async function askTrackerQuestions() {
  return await inquirer.prompt(trackerQuestions);
}

const startQuestions = () => {
  askTrackerQuestions()
    .then(tableOptions)
    .catch((err) => console.error(err));
};

startQuestions();

function showDepartment() {
  db.query(`SELECT * FROM departments`, function (err, results) {
    console.table(`\nDepartments Table:`, results);
    startQuestions();
  });
}

function showRoles() {
  db.query(
    `SELECT roles.id, title, salary, departments.department 
    FROM roles JOIN departments ON roles.department_id = departments.id`,
    function (err, results) {
      console.table(`\nRoles Table:`, results);
      startQuestions();
    }
  );
}

function showEmployees() {
  db.query(
    `SELECT 
    employee.id, employee.first_name, employee.last_name, roles.title, departments.department, roles.salary, 
    CONCAT(e1.first_name, ' ', e1.last_name) AS manager
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employee e1 ON employee.manager_id = e1.id`,
    function (err, results) {
      console.table(`\nEmployee Table:`, results);
      startQuestions();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter a new department name:",
      },
    ])
    .then(updateDepartment);
}

function updateDepartment(answers) {
  const addedDepartment = answers.addDepartment;
  db.query(
    `INSERT INTO departments (department)
    VALUES ("${addedDepartment}")`,
    function (err, results) {
      console.log(addedDepartment + " added!");
      startQuestions();
    }
  );
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Enter a new role:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter a salary for the new role:",
      },
      {
        type: "list",
        name: "department",
        choices: createDepartmentArray(),
        message: "Select a new department:",
      },
    ])
    .then(updateRole);
}

function createDepartmentArray() {
  const departmentArray = [];
  db.query(`SELECT department FROM departments`, function (err, results) {
    results.forEach((departments) =>
      departmentArray.push(departments.department)
    );
  });
  return departmentArray;
}

async function updateRole(answer) {
  const { roleName, salary, department } = answer;
  departmentId(department).then((id) => {
    db.query(
      `INSERT INTO roles (title, salary, department_id)
    VALUES ("${roleName}", "${salary}", "${id}")`,
      function (err, results) {
        console.log(roleName + " added!");
        startQuestions();
      }
    );
  });
}

function departmentId(department) {
  return new Promise((res, rej) => {
    db.query(
      `SELECT id FROM departments WHERE department = "${department}"`,
      function (err, results) {
        if (err) return rej(err);
        return res(results[0].id);
      }
    );
  });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employees first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?",
      },
      {
        type: "list",
        name: "roles",
        choices: createRoleArray(),
        message: "Select a role for the new employee:",
      },
      {
        type: "list",
        name: "manager",
        choices: createManagerArray(),
        message: "Select Manager for new employee:",
      },
    ])
    .then(newEmployee);
}

function createRoleArray() {
  const roleArray = [];
  db.query(`SELECT id, title FROM roles`, function (err, results) {
    results.forEach((roles) =>
      roleArray.push(`${roles.title} - Role ID: ${roles.id}`)
    );
  });
  return roleArray;
}

function createManagerArray() {
  const managerArray = [];
  db.query(
    `SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`,
    function (err, results) {
      results.forEach((manager) =>
        managerArray.push(
          `${manager.first_name} ${manager.last_name} - Role ID:${manager.id}`
        )
      );
    }
  );
  return managerArray;
}

function newEmployee(answer) {
  const { firstName, lastName, roles, manager } = answer;
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
  VALUES ("${firstName}", "${lastName}", "${roles.split(":")[1]}", "${
      manager.split(":")[1]
    }")`,
    function (err, results) {
      console.log(`${firstName} ${lastName} added to employee table`);
      startQuestions();
    }
  );
}

async function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "updatedEmployee",
        choices: await createEmployeeArray(),
        message: "Select employee to update:",
      },
      {
        type: "list",
        name: "newRole",
        choices: createRoleArray(),
        message: "Select a new role for the employee:",
      },
    ])
    .then(newRole);
}

function createEmployeeArray() {
  const employeeArray = [];
  return new Promise((resolve, rej) => {
    db.query(
      `SELECT id, first_name, last_name FROM employee`,
      function (err, results) {
        results.forEach((updatedEmployee) =>
          employeeArray.push(
            `${updatedEmployee.first_name} ${updatedEmployee.last_name} ID:${updatedEmployee.id}`
          )
        );
        resolve(employeeArray);
      }
    );
  });
}

function newRole(answer) {
  const { updatedEmployee, newRole } = answer;
  db.query(
    `UPDATE employee SET role_id = ${newRole.split(":")[1]} WHERE id = ${
      updatedEmployee.split(":")[1]
    }`,
    function (err, results) {
      console.log(updatedEmployee + " updated!");
      startQuestions();
    }
  );
}


function tableOptions(answers) {
  const answer = answers.employeeTracker;
  if (answer === "View all departments") {
    showDepartment();
  } else if (answer === "View all roles") {
    showRoles();
  } else if (answer === "View all employees") {
    showEmployees();
  } else if (answer === "Add a department") {
    addDepartment();
  } else if (answer === "Add a role") {
    addRole();
  } else if (answer === "Add an employee") {
    addEmployee();
  } else if (answer === "Update an employee role") {
    updateEmployee();
  }
}
