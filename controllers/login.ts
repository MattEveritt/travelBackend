import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { Router, Request, Response } from 'express';

const loginRouter: Router = Router();

loginRouter.post('/', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid email or password',
        });
    }

    const userForToken = {
        firstName: user.firstName,
        id: user._id,
    };

    const SECRET = process.env.SECRET || '';

    // token expires in 60*60 seconds, that is, in one hour
    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });

    const refreshToken = jwt.sign(userForToken, SECRET, {
        expiresIn: 60 * 60 * 24 * 7,
    });

    response.status(200).send({
        refreshToken,
        token,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id,
    });
});

export default loginRouter;
