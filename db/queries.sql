USE employee_db;

SOURCE ./db/schema.sql;
SOURCE ./db/seeds.sql;

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;

SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.dept_name, 
        employee.manager_id
        FROM employee
        JOIN role ON employee.role_id=role.id
        JOIN department ON role.department_id = department.id;

-- employee ids, first names, last names, job titles, departments, 
-- salaries, and managers that the employees report to