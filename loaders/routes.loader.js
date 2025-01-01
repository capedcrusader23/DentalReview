const smsRoutes = require("../routes/sms.routes");
const reviewRoutes = require("../routes/review.routes");
const paymentRoutes = require("../routes/payment.routes");

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/sms`, smsRoutes);
        app.use(`/api/${version}/review`, reviewRoutes);
        app.use(`/api/${version}/payment`, paymentRoutes);
    }
}

module.exports = { RoutesLoader };