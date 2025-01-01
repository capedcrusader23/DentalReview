const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cors = require('cors')
const passport = require('passport');

// require("../model/index.model")

class ExpressLoader {
    static init() {
        const app = express();

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        app.use(
            cors({
                origin: [
                    'http://localhost:3000',
                    'https://localhost:3000',
                ],
                credentials: true,
                preflightContinue: false,
            }),
        );
        app.use(
            session({
                store: new FileStore({ secret: 'prototype' }),
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    // secure: true,
                    // sameSite: 'none',
                },
                rolling: true,
                secret: 'prototype',
            }),
        );

        app.use(passport.initialize());
        app.use(passport.session());

        app.set('trust proxy', 1);

        return app;
    }
}

module.exports = { ExpressLoader };