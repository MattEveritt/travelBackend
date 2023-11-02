import {Router, Request, Response, NextFunction} from 'express';
import Trip from '../models/trip';
import User from '../models/user';

const tripsRouter: Router = Router();

tripsRouter.post('/saveTrip', async (request: Request, response: Response, next: NextFunction) => {
  const { type, departureAirport, destinations, dates, travellers, transport, userId } = request.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new Error('user not found in saveTrip controller'))
  }

  const trip = new Trip({
    type,
    departureAirport,
    destinations,
    dates,
    travellers,
    transport,
    user: user._id,
  });

  try {
    const savedTrip = await trip.save();
    user.trips = user.trips.concat(savedTrip._id);
    await user.save();

    response.status(201).json(savedTrip);
  } catch (e: any) {
    return next(e);
  }
});

tripsRouter.put('/updateTrip', async (request: Request, response: Response, next: NextFunction) => {
  const { type, departureAirport, destinations, dates, travellers, transport, userId, tripId } = request.body;

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return next(new Error('trip not found in updateTrip controller'))
  }

  trip.type = type;
  trip.departureAirport = departureAirport;
  trip.destinations = destinations;
  trip.dates = dates;
  trip.travellers = travellers;
  trip.transport = transport;
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