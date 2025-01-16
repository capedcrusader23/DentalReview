const config = require('config');
const cors = require('cors');

require('dotenv').config();

const { ExpressLoader } = require('./loaders/express.loader');
const app = ExpressLoader.init();

// CORS options
const corsOptions = {
  origin: 'https://getvalu3.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // Preflight results cache for 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Configure CORS - apply to all routes
app.use(cors(corsOptions));

// Handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

const { RoutesLoader } = require('./loaders/routes.loader');
const { MiddlewareLoader } = require('./loaders/middleware.loader');
// load express

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