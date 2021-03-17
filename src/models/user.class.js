class User {
    constructor(obj) {
        this.id = obj.id;
        this.address = obj.address;
        this.email = obj.email;
        this.name = obj.name;
        this.phoneNumber = obj.phoneNumber;
        this.role = obj.role;
    }
}

module.exports = User;
