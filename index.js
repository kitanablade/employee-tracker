const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require("./db/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
        `SELECT * FROM department ORDER BY dept_name`,
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
                        console.log(`${newEmployeeInfo.first_name} ${newEmployeeInfo.last_name} added to database.`);
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
      let empId = "";
      let roleId = "";
      db.query(
        `SELECT CONCAT(employee.first_name," ", employee.last_name) AS name, employee.id AS value
                FROM employee`,
        function (err, empNames) {
          if (err) {
            console.log(err);
          }
          inquirer
            .prompt([
              {
                type: "list",
                name: "employee_id",
                message: "Please select the employee whose role you'd like to update:",
                choices: empNames,
              },
            ]).then((data)=>{
              console.log("DATA LOG: ",data);
              empId = data.employee_id;
              db.query(
                `SELECT role.title AS name, role.id AS value
                    FROM role;
                    `,
                function (err, newRole) {
                  if (err) {
                    console.log(err);
                  }
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "new_role_id",
                        message: "Please select the employee's new role:",
                        choices: newRole,
                      },
                    ])
                    .then((data) => {
                      roleId = data.new_role_id;
                      db.query(
                        `UPDATE employee
                        SET role_id = ${roleId}
                        WHERE employee.id = ${empId}`,
                        function (err) {
                          if (err) {
                            console.log(err);
                          }
                          console.log("Employee's role successfully updated.")
                          console.log(
                            "================================================================"
                          );
                          selectOptions();
                        }
                      );
                    });
                }
              );
            })
        }
      );
      break;
      
    case "Quit":
      console.log("Have a nice day!");
      process.exit(1);
  }
}

selectOptions();
