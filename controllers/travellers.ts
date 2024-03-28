import {Router, Request, Response, NextFunction} from 'express';
import Traveller from '../models/traveller';
import User from '../models/user';

const travellersRouter: Router = Router();

travellersRouter.post('/savetraveller', async (request: Request, response: Response, next: NextFunction) => {
  const { name, surname, birthdate, userId } = request.body;
  if (!name) {
    console.log(name)
    return response.status(404).json('no name')
  }
  const user = await User.findById(userId);

  if (!user) {
    return next(new Error('user not found in save traveller controller'))
  }

  const traveller = new Traveller({
    name,
    surname,
    birthdate,
    user: user._id,
  });
  try {
    const savedtraveller = await traveller.save();
    user.travellers = user.travellers.concat(savedtraveller._id);
    await user.save();
    return response.status(201).json(savedtraveller);
  } catch (error) {
    (error: any) => next(error);
  }
});

travellersRouter.put('/updatetraveller', async (request: Request, response: Response, next: NextFunction) => {
  const { firstName, lastName, middleNames, birthdate, userId, travellerId } = request.body;

  const traveller = await Traveller.findById(travellerId);

  if (!traveller) {
    return next(new Error('traveller not found'))
  }

  traveller.firstName = firstName;
  traveller.lastName = lastName;
  traveller.middleNames = middleNames;
  traveller.birthdate = birthdate;
  traveller.travellerId = travellerId;
  traveller.userId = userId;

  try {
    await traveller.save();
    return response.status(204).end();
  } catch (e) {
    next(e);
  }
});

travellersRouter.delete('/deletetraveller', async (request: Request, response: Response, next: NextFunction) => {
  const {userId, travellerId} = request.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new Error('user not found in delete traveller controller'));
  }

  type TravellerObject = {
    id?: string,
  }

  try {
    const res = await Traveller.findByIdAndRemove(travellerId);
    if (!res) throw new Error('Traveller not found');
    user.travellers = user.travellers.filter((traveller: TravellerObject) => traveller.id !== travellerId);
    await user.save();
    return response.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default travellersRouter;