const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// *** Done: THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// *** Done: WHEN I choose to view all departments
// *** Done: THEN I am presented with a formatted table showing department names and department ids
// *** Done: WHEN I choose to view all roles
// *** Done: THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// *** Done: WHEN I choose to view all employees
// *** Done: THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// *** Done: WHEN I choose to add a department
// *** Done: THEN I am prompted to enter the name of the department and that department is added to the database
// *** Done: WHEN I choose to add a role
// *** Done: THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function selectOptions() {
  let option = await inquirer.prompt([
    {
      type: "list",
      name: "selectOptions",
      message: "Please select from one of the following options:",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
      ],
    },
  ]);

  // Presents a list of options to the user to interact with the db

  switch (option.selectOptions) {
    case "View All Departments":
        db.query(`SELECT * FROM department`, function (err, results) {
            if (err) {
              console.log(err);
            }
            console.table(results);
            selectOptions();
          });
      
      break;

    case "View All Roles":
      db.query(
        `SELECT role.id, role.title, role.salary, department.dept_name
        FROM role
        INNER JOIN department ON role.department_id=department.id;
        `,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.table(results);
          selectOptions();
        });

      break;

    case "View All Employees":
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, 
        employee.manager_id
        FROM employee
        JOIN role ON employee.role_id=role.id
        JOIN department ON role.department_id = department.id;
        `,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.table(results);
          selectOptions();
        }
      );

      break;
    case "Add a Department":
      let newDept = inquirer.prompt([
        {
          type: "input",
          name: "dept_name",
          message: "Please enter the new department:",
        },
      ]);

      db.query(
        `INSERT INTO department (dept_name)
          VALUES (?)`,
        newDept.dept_name,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`${newDept.dept_name} added to database.`);
        }
      );
      break;

    //   name, salary, and department for the role
    case "Add a Role":
      let newRole = await inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Please enter new role title:",
        },
        {
          type: "input",
          name: "salary",
          message: "Please enter the new role salary:",
        },
        {
          type: "list",
          name: "deptOptions",
          message: "Please select the department the new role belongs to:",
          choices: [
            // An array returned from a SQL query
            // newRole.deptOptions;
          ],
        },
      ]);

      db.query(
        `INSERT INTO role (title, salary, newRole.deptOptions)
          VALUES (?)`,
        newRole.title,
        newRole.salary,
        newRole.deptOptions,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`${newRole.title} added to database.`);
        }
      );
      break;

    //   first name, last name, role, and manager
    case "Add an Employee":
        let newEmployee = await inquirer.prompt([
            {
              type: "input",
              name: "first_name",
              message: "Please enter new employee's first name:",
            },
            {
              type: "input",
              name: "last_name",
              message: "Please enter the new employee's last name:",
            },
            // {
            //     type: "list",
            //     name: "title",
            //     message: "Please select the department the new role belongs to:",
            //     choices: ()=> [db.query(
            //         `SELECT role.title AS name, role.id AS value
            //         FROM role;
            //         `),
            //     ],
            //   },
        ]);

          db.query(
            `INSERT INTO employee (first_name, last_nanme)
              VALUES (?)`,
            newEmployee.first_name,
            newEmployee.last_name,
            //newRole.deptOptions,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              //console.log(`${newEmployee.first_name} ${newEmployee.last_name}added to database.`);
            }
          );
      break;

    case "Update an Employee Role":
      break;

    case "Quit":
      console.log("Have a nice day!");
      break;
  }
};

selectOptions();
