import bcrypt from 'bcrypt';
import {Router, Request, Response, NextFunction} from 'express'
import User from '../models/user';
import Traveller from '../models/user';

const usersRouter: Router = Router();

usersRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const { email, username, name, password } = request.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return response.status(400).json('Email address already registered');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    username: username,
    name,
    passwordHash,
  });

  const traveller = new Traveller({
    name: user.name,
    surname: user.name,
  });

  try {
    const savedTraveller = await traveller.save();
    if (!savedTraveller) {
      return next(new Error('Traveller not found in users controller'));
    }
    user.travellers = user.travellers.concat(savedTraveller._id);
    const savedUser = await user.save();

    if(!savedUser) {
      return next(new Error('User not saved'))
    }
  
    return response.status(201).json(savedUser);
  } catch (e) {
    next(e);
  }
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

  type TravellerObject = {
    id?: string,
    name?: string,
    surname?: string,
    middleNames?: string,
    birthdate?: string,
  }

  let travellers = {};
  
  user.travellers.map((traveller: TravellerObject) => {
    if (!traveller.id) return null;
    const id = traveller.id;
    travellers = {
      ...travellers,
      [id]: {
        name: traveller.name,
        surname: traveller.surname,
        middleNames: traveller.middleNames,
        birthdate: traveller.birthdate,
        id: id,
      }
    }
  })

  return response.status(200).json(travellers);
});

usersRouter.post('/resetpassword', async (request: Request, response: Response, next: NextFunction) => {
  const {email} = request.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      return response.status(200).json('Reset password request sent');
    } else {
      return response.status(404).json('Email is not registered to any accounts');
    }
  } catch (e) {
    return next(new Error(`error finding email address in resetPassword controller: ${e}`,))
  }
});

export default usersRouter;