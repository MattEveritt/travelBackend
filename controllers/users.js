const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
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

  return response.status(201).json(savedUser);
});

usersRouter.get('/trips', async (request, response) => {
  const { userId } = request.query;
  const user = await User.findById(userId).populate('trips');
  response.json(user.trips);
});

module.exports = usersRouter;