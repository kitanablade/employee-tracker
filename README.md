# Employee Tracker

![Eclipse Marketplace](https://img.shields.io/eclipse-marketplace/l/notepad4e?color=red)
## Description 
This program allows the user to interact with a database of their employees and their data.

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```
## Demo Video Link
[Screencastify Video on Google Drive]https://drive.google.com/file/d/1bd_poyP44JkMHvOae62dMw44phfXsA-5/view)

## Acceptnce Criteria
```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```
```
## Table of Contents
* [Installation](#installation)
* [Usage Information](#usage-information)
* [License](#license)
* [Contribution Information](#contribution-information)
* [Tests](#tests)
* [Questions](#questions)
## Installation 
To install, run the following commands:
```bash
npm i
node index.js
```
## Usage Information
Follow the prompts on the command line, and enter your desired information. The program will populate your data to the Database. You can re-run the program to overwrite the Database items if desired. 
## License
This app is licensed under the Eclipse Marketplace (EPL 2.0) license.
## Contribution Information
If you wish to contribute, please contact the developer.
## Tests
Coming soon in V1.1
## Questions 
For more information, please [email me](mailto:kit@gmail.com) or see [kitanablade's Github page](https://github.com/kitanablade).
#### [⬆️ Back to Top](#description)