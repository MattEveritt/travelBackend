const refreshRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

refreshRouter.post('/', async (request, response) => {
  const { refreshToken } = request.body;
  const { id } = jwt.verify(refreshToken, process.env.SECRET);
  if (!id) {
    return response.status(401).json({ error: 'refresh token invalid' });
  }

  const user = await User.findById({ _id: id });
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 }
  );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = refreshRouter;