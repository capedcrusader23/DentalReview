const config = require('config');

const { ErrorCodes } = require("../errorCodes.utils");

class ValidationException extends Error {
    constructor(code, message, data) {
        super(message);
        if (config.get("config").get("env") === "dev") this.message = `Validation Error: ${message}`;
        else this.message = message;
        this.name = "Validation Error";
        this.code = code;
        this.error = this.constructor.name;
        this.status = 400;
        this.data = data;
    }
}

class InvalidPropertiesException extends ValidationException {
    constructor(message) {
        super(ErrorCodes.InvalidPropertiesException, message,message);
    }
}

module.exports = { InvalidPropertiesException };