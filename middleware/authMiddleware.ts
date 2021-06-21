import { NextFunction, Request, Response } from 'express';
import { validationAccessToken } from '../services/token-services';

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.method === 'OPTIONS') {
		next();
	}

	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res.status(401).json({ message: 'Пользователь не авторизован!' });
		}

		const userData = validationAccessToken(token);

		if (!userData) {
			return res.status(401).json({ message: 'Пользователь не авторизован!' });
		}

		// @ts-expect-error Тут я просто положу в обьект запроса юзер дату, чтобы дальше в цепоче использовать ее
		req.user = userData;

		next();
	} catch (error) {
		return res.status(401).json({ message: 'Пользователь не авторизован!' });
	}
};
