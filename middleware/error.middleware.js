const config = require('config');

const { InternalServerException } = require('../utils/exceptions/api.exeception')

function errorMiddleware(err, req, res, next) {
    if (err.status === 500 || !err.message) {
        if (!err.isOperational) err = new InternalServerException('Internal server error');
    }
    let { message, code, error, status, data, stack } = err;

    if process.env.ENV === "dev") {
        console.log(`[Exception] ${error}, [Code] ${code}`);
        console.log(`[Error] ${message}`);
        console.log(`[Stack] ${stack}`);
    }

    const headers = {
        success: "0",
        error,
        code,
        message,
        ...(data) && data,
    };

    res.status(status).send({ headers, body: {} });
}

module.exports = errorMiddleware;