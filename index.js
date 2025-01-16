const config = require('config');
const cors = require('cors');

require('dotenv').config();
const { ExpressLoader } = require('./loaders/express.loader');
const { RoutesLoader } = require('./loaders/routes.loader');
const { MiddlewareLoader } = require('./loaders/middleware.loader');
// load express
const app = ExpressLoader.init();

// Configure CORS
app.use(cors({
  origin: 'https://getvalu3.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// init routes
const version = "v1";
RoutesLoader.initRoutes(app, version);

// init middleware
MiddlewareLoader.init(app);

console.log("STARTING")
// starting the server
const port = process.env.PORT;
app.listen(port, () => console.log(`
  ==================================
  🚀 Server running on port ${port}!🚀
  ==================================
`));

module.exports = app;