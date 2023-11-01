import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import cors from 'cors';

import admin from 'firebase-admin';
import routes from './routes';

// Importando nossa database
import './database';

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/order
import * as dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
    origin: '*', // Substitua pela origem que você deseja permitir
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: '*',
    maxAge: 86400,
};

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();

        // eslint-disable-next-line global-require
        const serviceAccount = require('./config/firebaseConfigJs');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://ommc-invest.firebaseapp.com', // Substitua pelo URL do seu projeto Firebase
        });
    }

    middlewares() {
        this.server.use(cors(corsOptions));
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
