const inquirer = require("inquirer");
const fs = require("fs");

const trackerQuestions = {
    type: "list",
    name: "Employee Tracker",
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
  
  askTrackerQuestions();