import {Router, Request, Response, NextFunction} from 'express';
import Trip from '../models/trip';
import User from '../models/user';

const tripsRouter: Router = Router();

tripsRouter.post('/saveTrip', async (request: Request, response: Response, next: NextFunction) => {
  const { destination, budget, dates, travellers, userId } = request.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new Error('user not found in saveTrip controller'))
  }

  const trip = new Trip({
    destination,
    budget,
    dates,
    travellers,
    user: user._id,
  });

  try {
    const savedTrip = await trip.save();
    user.trips = user.trips.concat(savedTrip._id);
    await user.save();

    response.status(201).json(savedTrip);
  } catch (e) {
    (e: {}) => next(e);
  }
});

tripsRouter.put('/updateTrip', async (request: Request, response: Response, next: NextFunction) => {
  const { destination, budget, dates, travellers, userId, tripId } = request.body;

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return next(new Error('trip not found in updateTrip controller'))
  }

  trip.destination = destination;
  trip.budget = budget;
  trip.dates = dates;
  trip.travellers = travellers;
  trip.userId = userId;

  await trip.save().then(() => {
    return response.status(204).end();
  })
    .catch(error => next(error));
});

tripsRouter.delete('/deleteTrip', async (request: Request, response: Response, next: NextFunction) => {
  Trip.findByIdAndRemove(request.query.id)
    .then(() => {
      return response.status(204).end();
    })
    .catch(error => next(error));
});

export default tripsRouter;