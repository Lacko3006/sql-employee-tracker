DROP DATABASE IF EXISTS employeetracker_db;

CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    department_id INT NOT NULL
);
