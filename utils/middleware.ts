import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from './logger';
import {Request, Response, NextFunction} from 'express';

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info(`Method: ${request.method}`);
  logger.info(`Path: ${request.path}`);
  logger.info(`Body: ${JSON.stringify(request.body)}`);
  logger.info('---');
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  return response.status(404).send({ error: 'unknown endpoint' });
};

interface Error {
  message: string,
  name: string,
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    });
  }

  next(error);
};

const getTokenFrom = (request: Request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return '';
};

const tokenVerification = (request: Request, response: Response, next: NextFunction) => {
  if (request.path !== '/api/login' && request.path !== '/api/refresh' && request.path !== '/api/users') {
    const SECRET = process.env.SECRET || '';
    const decodedToken = jwt.verify(getTokenFrom(request), SECRET) as JwtPayload;
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
  }
  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenVerification,
};