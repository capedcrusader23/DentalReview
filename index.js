const config = require('config');
const cors = require('cors');

require('dotenv').config();

const { ExpressLoader } = require('./loaders/express.loader');
const app = ExpressLoader.init();

// Enable pre-flight requests for all routes
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://getvalu3.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Apply CORS globally
app.use(cors({
  origin: 'https://getvalu3.com',
  credentials: false
}));

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