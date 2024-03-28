import config from './utils/config';
import express, { Application } from 'express';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';
import logoutRouter from './controllers/logout';
import tripsRouter from './controllers/trips';
import refreshRouter from './controllers/refresh';
import middleware from './utils/middleware';
import logger from './utils/logger';
import mongoose from 'mongoose';
import travellersRouter from './controllers/travellers';
import flightsRouter from './controllers/flights';
import hotelsRouter from './controllers/hotels';
import transfersRouter from './controllers/transfers';

mongoose.set('strictQuery', false);

logger.info(`connecting to ${config.MONGODB_URI}`);

mongoose
    .connect(`${config.MONGODB_URI}`)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(error => {
        logger.error(`error connecting to MongoDB: ${error.message}`);
    });

const app: Application = express();

app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenVerification);

app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/refresh', refreshRouter);
app.use('/api/travellers', travellersRouter);
app.use('/api/flights', flightsRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/transfers', transfersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
