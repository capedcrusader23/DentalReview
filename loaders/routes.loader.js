const smsRoutes = require("../routes/sms.routes");
const reviewRoutes = require("../routes/review.routes");

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/sms`, smsRoutes);
        app.use(`/api/${version}/review`, reviewRoutes);
    }
}

module.exports = { RoutesLoader };