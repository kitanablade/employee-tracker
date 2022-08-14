const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require("./db/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
      db.query(
        `SELECT * FROM department ORDER BY dept_name DESC`,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.table(results);
          console.log(
            "================================================================"
          );
          selectOptions();
        }
      );
      break;

    case "View All Roles":
      db.query(
        `SELECT role.title, role.id, department.dept_name, role.salary
        FROM role
        INNER JOIN department ON role.department_id=department.id
        ORDER BY role.title;
        `,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          console.table(results);
          console.log(
            "================================================================"
          );
          selectOptions();
        }
      );
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
          console.log(
            "================================================================"
          );
          selectOptions();
        }
      );
      break;

    case "Add a Department":
      inquirer
        .prompt([
          {
            type: "input",
            name: "dept_name",
            message: "Please enter the new department:",
          },
        ])
        .then((data) => {
          let newDept = data.dept_name;
          db.query(
            `INSERT INTO department (dept_name) VALUES (?)`,
            newDept,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(`${newDept} added to database.`);
              console.log(
                "================================================================"
              );
              selectOptions();
            }
          );
        });
      break;

    case "Add a Role":
      db.query(
        `SELECT dept_name AS name, id AS value
            FROM department;
            `,
        function (err, results) {
          if (err) {
            console.log(err);
          }
          inquirer
            .prompt([
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
                name: "department_id",
                message:
                  "Please select the department the new role belongs to:",
                choices: results,
              },
            ])
            .then((data) => {
              let title = data.title;
              let salary = data.salary;
              let deptId = data.department_id;
              db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [title, salary, deptId],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(`${title} added to database.`);
                  console.log(
                    "================================================================"
                  );
                  console.log(data);
                  selectOptions();
                }
              );
            });
        }
      );

      break;

    //   first name, last name, role, and manager
    case "Add an Employee":
      let newEmployeeInfo = {
        first_name: "",
        last_name: "",
        employee_id: "",
        manager_id: "",
      };
      db.query(
        `SELECT role.title AS name, role.id AS value
            FROM role;
            `,
        function (err, roleResults) {
          
          if (err) {
            console.log(err);
          }
          inquirer
            .prompt([
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
              {
                type: "list",
                name: "role_id",
                message: "Please select the employee's role:",
                choices: roleResults,
              },
            ])
            .then((data) => {
              newEmployeeInfo.first_name = data.first_name;
              newEmployeeInfo.last_name = data.last_name;
              newEmployeeInfo.role_id = data.role_id;
              newEmployeeInfo.manager_id = "";
              db.query(
                `SELECT CONCAT(employee.first_name," ", employee.last_name) AS name, employee.id AS value
                FROM employee
                JOIN role ON employee.role_id=role.id
                WHERE title = "Manager"`,
                function (err, mgrNames) {
                  if (err) {
                    console.log(err);
                  }
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager_id",
                      message: "Please select the manager of the new employee:",
                      choices: mgrNames,
                    },
                  ]).then((data)=>{
                    newEmployeeInfo.manager_id = data.manager_id;
                    db.query(
                      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
                      [newEmployeeInfo.first_name, newEmployeeInfo.last_name, newEmployeeInfo.role_id, newEmployeeInfo.manager_id],
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        }
                        console.log(`${newEmployeeInfo} added to database.`);
                        console.log(
                          "================================================================"
                        );
                        selectOptions();
                      }
                    );
                  })
                }
              );
            });
        }
      );
      break;

    case "Update an Employee Role":
      break;

    case "Quit":
      console.log("Have a nice day!");
      break;
  }
}

//can also delete callback function and just do return db.query
function getManagers() {
  db.query(
    `SELECT CONCAT(employee.first_name," ", employee.last_name) AS mgr_fullname, employee.id
  FROM employee
  JOIN role ON employee.role_id=role.id
  WHERE title = "Manager"`,
    function (err, mgrNames) {
      if (err) {
        console.log(err);
      }
      return mgrNames;
    }
  );
}

// let newDept = data.dept_name;
// db.query(
//   `INSERT INTO department (dept_name) VALUES (?)`,
//   newDept,
//   (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(`${newDept} added to database.`);
//     console.log(
//       "================================================================"
//     );
//     selectOptions();
//   }
// );

selectOptions();
