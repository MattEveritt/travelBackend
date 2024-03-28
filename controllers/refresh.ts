import { Router, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';

const refreshRouter: Router = Router();

refreshRouter.post('/', async (request: Request, response: Response) => {
    const SECRET = process.env.SECRET || '';
    const { refreshToken } = request.body;

    try {
        const { id } = jwt.verify(refreshToken, SECRET) as JwtPayload;

        if (!id) {
            return response
                .status(401)
                .json({ error: 'refresh token invalid' });
        }

        const user = await User.findById({ _id: id });

        if (!user) {
            return response.status(401).json({ error: 'user not found' });
        }

        const userForToken = {
            username: user.firstName,
            id: user._id,
        };

        // token expires in 60*60 seconds, that is, in one hour
        const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 });

        response.status(200).send({
            token,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
        });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            const { id } = jwt.decode(refreshToken) as JwtPayload;

            if (!id) {
                return response
                    .status(401)
                    .json({ error: 'refresh token invalid' });
            }

            const user = await User.findById({ _id: id });

            if (!user) {
                return response.status(401).json({ error: 'user not found' });
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            };

            // token expires in 60*60 seconds, that is, in one hour
            const newAccessToken = jwt.sign(userForToken, SECRET, {
                expiresIn: 60,
            });

            // refresh token expires in 60 * 60 * 24 * 7 * 60 seconds, that is, in one week
            const newRefreshToken = jwt.sign(userForToken, SECRET, {
                expiresIn: 60 * 60 * 24 * 7,
            });

            response.status(200).send({
                refreshToken: newRefreshToken,
                token: newAccessToken,
                username: user.username,
                name: user.firstName,
                surname: user.lastName,
                userId: user._id,
            });
        }
    }
});

export default refreshRouter;
