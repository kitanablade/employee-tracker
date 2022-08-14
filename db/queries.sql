USE employee_db;

SOURCE ./db/schema.sql;
SOURCE ./db/seeds.sql;

-- SELECT * FROM department;
-- SELECT * FROM role;
SELECT * FROM employee;

-- SELECT (SELECT role.title AS name, role.id AS value
--             FROM role) AS roles,
--         (SELECT )

SELECT CONCAT(employee.first_name," ", employee.last_name) AS mgr_fullname, employee.id
        FROM employee
        JOIN role ON employee.role_id=role.id
        WHERE title = "Manager";

