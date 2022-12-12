const Department = require("./department");

class Role extends Department {
    constructor (id, title, salary, department_id) {

        super(id);
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
    getTitle(){
        console.log("This works")
        return this.title
    }
    getSalary(){
        return this.salary
    }
    getDepartmentId(){
        return this.department_id
    }
}

module.exports = Role