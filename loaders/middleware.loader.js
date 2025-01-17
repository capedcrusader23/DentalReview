const { InvalidEndpointException } = require('../utils/exceptions/api.exeception');
const errorMiddleware = require('../middleware/error.middleware');

class MiddlewareLoader {
    static init(app) {
        // 404 endpoint handler
        app.all('*', (req, res, next) => {
            console.log({
                req,
            })
            const err = new InvalidEndpointException();
            next(err);
        });

        // Error middleware
        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };