const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const consoleTable = require("console.table");

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
  db.query(`SELECT * FROM roles`, function (err, results) {
    console.table(`\nRoles Table:`, results);
    startQuestions();
  });
}

function tableOptions(answers) {
  const answer = answers.employeeTracker;
  if (answer === "View all departments") {
    showDepartment();
  } else if ((answer = "View all roles")) {
    showRoles();
  }
}
