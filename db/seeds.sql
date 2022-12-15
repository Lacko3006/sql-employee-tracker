ALTER TABLE departments AUTO_INCREMENT=0;
ALTER TABLE roles AUTO_INCREMENT=0;
ALTER TABLE employee AUTO_INCREMENT=0;

INSERT INTO departments (department)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

-- employee ids, first names, last names, job titles, departments, salaries, and managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1),
       ("Sam", "Laxton", 2, 2);