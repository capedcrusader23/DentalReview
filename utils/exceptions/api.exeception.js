const config = require('config');

const { ErrorCodes } = require("../errorCodes.utils");
const { ErrorStatusCodes } = require("../errorStatusCodes.utils");

class ApiException extends Error {
    constructor(code, message, data, status = 401) {
        super(message);
        if process.env.ENV === "dev") this.message = `Api Error: ${message}`;
        else this.message = message;
        this.name = "Api Error";
        this.code = code;
        this.error = this.constructor.name;
        this.status = status;
        this.data = data;
    }
}

class InternalServerException extends ApiException {
    constructor(message, data) {
        super(ErrorCodes.InternalServerException, message, data, ErrorStatusCodes.InternalServerException);
    }
}

class InvalidEndpointException extends ApiException {
    constructor(message = "Endpoint Not Found", data) {
        super(ErrorCodes.InvalidEndpointException, message, data, ErrorStatusCodes.InvalidEndpointException);
    }
}

class UnimplementedException extends ApiException {
    constructor(message = "API unimplemented", data) {
        super(ErrorCodes.UnimplementedException, message, data, ErrorStatusCodes.UnimplementedException);
    }
}

class HealthCheckFailedException extends ApiException {
    constructor(data) {
        super(ErrorCodes.HealthCheckFailedException, "API failed to run", data, ErrorStatusCodes.HealthCheckFailedException);
    }
}

class RequestTimeOutException extends ApiException {
    constructor(message) {
        super(ErrorCodes.RequestTimeOutException, "Request Timeout to downstream service", message, ErrorStatusCodes.RequestTimeOut);
    }
}

class InvalidParameterException extends ApiException {
    constructor(message) {
        super(ErrorCodes.InvalidPropertiesException, "Parameters missing in request", message, ErrorStatusCodes.InvalidPropertiesException);
    }
}
class RuntimeException extends ApiException {
    constructor(message) {
        super(ErrorCodes.RuntimeExceptionException, message, message, ErrorStatusCodes.InvalidPropertiesException);
    }
}

module.exports = {
    InternalServerException,
    InvalidEndpointException,
    UnimplementedException,
    HealthCheckFailedException,
    RequestTimeOutException,
    InvalidParameterException,
    RuntimeException,
};