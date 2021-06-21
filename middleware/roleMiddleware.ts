import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const roleMiddleware = (roles: Array<string>) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.method === 'OPTIONS') {
			next();
		}

		try {
			const token = req.headers.authorization?.split(' ')[1];

			if (!token) {
				return res
					.status(403)
					.json({ message: 'Пользователь не авторизован!' });
			}

			const secret = process.env.JWT_ACCESS_SECRET_KEY;

			if (secret) {
				const userData: any = jwt.verify(token, secret);

				let hasRole = false;

				roles.forEach((role) => {
					if (userData.roles.includes(role)) {
						hasRole = true;
					}
				});

				if (!hasRole) {
					return res.status(400).json({ message: 'У вас нету доступа!' });
				}
			}

			next();
		} catch (error) {
			return res.status(403).json({ message: 'Пользователь не авторизован!' });
		}
	};
};
