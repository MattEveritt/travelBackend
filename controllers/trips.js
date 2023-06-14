const tripsRouter = require('express').Router();
const Trip = require('../models/trip');
const User = require('../models/user');

tripsRouter.post('/saveTrip', async (request, response) => {
  const { destination, budget, dates, travellers, userId } = request.body;

  const user = await User.findById(userId);

  const trip = new Trip({
    destination,
    budget,
    dates,
    travellers,
    user: user._id,
  });

  const savedTrip = await trip.save();
  user.trips = user.trips.concat(savedTrip._id);
  await user.save();

  response.status(201).json(savedTrip);
});

tripsRouter.put('/updateTrip', async (request, response, next) => {
  const { destination, budget, dates, travellers, userId, tripId } = request.body;

  const trip = await Trip.findById(tripId);
  trip.destination = destination;
  trip.budget = budget;
  trip.dates = dates;
  trip.travellers = travellers;
  trip.userid = userId;

  await trip.save().then(() => {
    return response.status(204).end();
  })
    .catch(error => next(error));
});

tripsRouter.delete('/deleteTrip', async (request, response, next) => {
  Trip.findByIdAndRemove(request.query.id)
    .then(() => {
      return response.status(204).end();
    })
    .catch(error => next(error));
});

module.exports = tripsRouter;