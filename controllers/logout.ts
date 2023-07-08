import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Router, Request, Response} from 'express';
import User from '../models/user';

const logoutRouter: Router = Router();

logoutRouter.post('/', async (request: Request, response: Response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const SECRET = process.env.SECRET || '';

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60 * 60 }
  );

  const refreshToken = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60 * 60 * 24 * 7 }
  );

  response
    .status(200)
    .send({ refreshToken, token, username: user.username, name: user.name });
});

export default logoutRouter;