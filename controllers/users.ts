import bcrypt from 'bcrypt';
import {Router, Request, Response, NextFunction} from 'express'
import User from '../models/user';
import Traveller from '../models/user';

const usersRouter: Router = Router();

usersRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const { email, username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  const traveller = new Traveller({
    name: user.name,
    surname: user.name,
  });

  await traveller.save().catch((error) => next(error));

  return response.status(201).json(savedUser);
});

usersRouter.get('/trips', async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.query;
  const user = await User.findById(userId).populate('trips');

  if (!user) {
    return next(new Error('user not found in trips controller'))
  }

  return response.status(200).json(user.trips);
});

usersRouter.get('/travellers', async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request.query;
  const user = await User.findById(userId).populate('travellers');

  if (!user) {
    return next(new Error('user not found in travellers controller'))
  }

  return response.status(200).json(user.travellers);
});

export default usersRouter;