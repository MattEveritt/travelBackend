import {Router, Request, Response, NextFunction} from 'express';
import Traveller from '../models/traveller';
import User from '../models/user';

const travellersRouter: Router = Router();

travellersRouter.post('/savetraveller', async (request: Request, response: Response, next: NextFunction) => {
  const { name, surname, birthdate, userId } = request.body;

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
    console.log(savedtraveller);
    user.travellers = user.travellers.concat(savedtraveller._id);
    await user.save();
    return response.status(201).json(savedtraveller);
  } catch (error) {
    (error: any) => next(error);
  }
});

travellersRouter.put('/updatetraveller', async (request: Request, response: Response, next: NextFunction) => {
  const { name, surname, birthdate, userId, travellerId } = request.body;

  const traveller = await Traveller.findById(travellerId);

  if (!traveller) {
    return next(new Error('traveller not found'))
  }

  traveller.name = name;
  traveller.surname = surname;
  traveller.birthdate = birthdate;
  traveller.travellerId = travellerId;
  traveller.userId = userId;

  await traveller.save().then(() => {
    return response.status(204).end();
  })
    .catch(error => next(error));
});

travellersRouter.delete('/deletetraveller', async (request: Request, response: Response, next: NextFunction) => {
  Traveller.findByIdAndRemove(request.query.id)
    .then(() => {
      return response.status(204).end();
    })
    .catch(error => next(error));
});

export default travellersRouter;