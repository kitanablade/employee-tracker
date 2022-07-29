USE employee_db;

INSERT INTO department (dept_name)
VALUES ("Back-end"),
       ("Client-side"),
       ("Data");
       
INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 148000.00, 2),
        ("DBA", 82000.00, 3),
        ("Staff Engineer", 170000.00, 1),
        ("Manager", 190000.00, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Kit", "Williams", 3),
("Newt", "Ault", 2),
("Honu", "Bendixen", 1),
("Orville", "Zharoff", 4);
