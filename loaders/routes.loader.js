const smsRoutes = require("../routes/sms.routes");
const reviewRoutes = require("../routes/review.routes");
const paymentRoutes = require("../routes/payment.routes");
const insightRoutes = require("../routes/insights.routes");

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/sms`, smsRoutes);
        app.use(`/api/${version}/review`, reviewRoutes);
        app.use(`/api/${version}/payment`, paymentRoutes);
        app.use(`/api/${version}/insight`, insightRoutes);
    }
}

module.exports = { RoutesLoader };