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
// *** Done - THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// *** Done - WHEN I choose to view all departments
// *** Done THEN I am presented with a formatted table showing department names and department ids
// *** Done WHEN I choose to view all roles
// *** Done THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

//view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function selectOptions() {
    let exit = false;
    // while (!exit){
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
        "Quit"
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
          });
      break;

    case "View All Roles":
        db.query(`SELECT role.id, role.title, role.salary, department.dept_name
        FROM role
        INNER JOIN department ON role.department_id=department.id;
        `, function (err, results) {
            if (err) {
              console.log(err);
            }
            console.table(results);
          });

      break;

    case "View All Employees":
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, 
        employee.manager_id
        FROM employee
        JOIN role ON employee.role_id=role.id
        JOIN department ON role.department_id = department.id;
        `, function (err, results) {
            if (err) {
              console.log(err);
            }
            console.table(results);
          });

      break;
    case "Add a Department":
        let newDept = await inquirer.prompt([
            {
              type: "input",
              name: "dept_name",
              message: "Please enter the new department:",
            },
          ]);
        //   db.query(`INSERT INTO department (dept_name)
        //   VALUES ?`, 3, (err, result) => {
        //     if (err) {
        //       console.log(err);
        //     }
        //     console.log(`${newDept.dept_name} added to database.`);
        //   });
        db.query(`SET @variable = ${newDept.dept_name};
        INSERT INTO table (column) VALUES (@variable);`,(err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(`${newDept.dept_name} added to database.`);
          });
          
        
      break;

    case "Add a Role":
      break;

      
    case "Add an Employee":
      break;


    case "Update an Employee Role":
      break;

      case "Quit":
        console.log("Have a nice day!");
        exit == true;
  }
}
// }

selectOptions();

// Displays all columns in the table passed into the function
let viewSelection = (tableName) => {
  db.query(`SELECT * FROM ${tableName}`, function (err, results) {
    if (err) {
      console.log(err);
    }
    console.table(results);
  });
  //selectOptions();
};

