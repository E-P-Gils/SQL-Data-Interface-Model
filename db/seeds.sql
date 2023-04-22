INSERT INTO department(dep_name)
VALUES
('Customer Service'),
('Engineering'),
('Legal');

INSERT INTO role(title, salary, department_id)
VALUES
('Customer Service Manager', 75000, 1),
('Software Engineer', 90000, 2),
('Adjunct Lawyer', 85000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Dippy', 'Droplet', 1, NULL),
('Skip', 'Skyworth', 2, 1),
('Miles', 'Edgeworth', 3, 1),
