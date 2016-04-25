var Person = (function () {
    function Person(name, age, salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }
    Person.prototype.toString = function () {
        return this.name + " (" + this.age + ") (" + this.salary + ")"; // As of version 1.4
    };
    return Person;
})();
//# sourceMappingURL=main.js.map