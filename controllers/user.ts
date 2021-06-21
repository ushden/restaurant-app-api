import {
	findTokenInDB,
	validationRefreshToken,
} from './../services/token-services';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

import User from '../modules/user';
import Role from '../modules/role';
import { JWTTypes } from '../types';
import {
	deleteRefreshToken,
	generateTokens,
	saveRefreshToken,
} from '../services/token-services';

export const registration = async (req: Request, res: Response) => {
	try {
		const validationErrors = validationResult(req);

		if (!validationErrors.isEmpty()) {
			return res
				.status(400)
				.json({ message: 'Ошибка при регистрации', validationErrors });
		}

		const { name, password } = req.body;
		const candidate = await User.findOne({ name });

		if (candidate) {
			return res
				.status(400)
				.json({ message: 'Такой пользователь уже зарегестрирован' });
		}

		const hashPassword = bcrypt.hashSync(password, 3);
		const userRole = await Role.findOne({ value: 'USER' });
		const user = await new User({
			name,
			password: hashPassword,
			roles: [userRole.value],
		});

		await user.save();

		const payload: JWTTypes = {
			_id: user._id,
			roles: user.roles,
		};
		const tokens = generateTokens(payload);

		if (tokens?.refreshToken) {
			await saveRefreshToken(user._id, tokens.refreshToken);

			res.cookie('refreshToken', tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
		}

		return res.status(200).json({
			message: 'Пользователь успешно зарегестрирован',
			tokens,
			user: { _id: user._id, roles: user.roles, name: user.name },
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const adminLogin = async (req: Request, res: Response) => {
	try {
		const { name, password } = req.body;
		console.log(name, password);
		const user = await User.findOne({ name });

		if (!user) {
			return res
				.status(404)
				.json({ message: `Пользователь ${name} не найден` });
		}

		if (!user.roles.includes('ADMIN')) {
			return res.status(403).json({ message: 'У вас нету доступа!' });
		}

		const validPassword = bcrypt.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({ message: 'Неверный пароль!' });
		}

		const payload: JWTTypes = {
			_id: user._id,
			roles: user.roles,
		};
		const tokens = generateTokens(payload);

		if (tokens?.refreshToken) {
			await saveRefreshToken(user._id, tokens.refreshToken);

			res.cookie('refreshToken', tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
		}

		return res.status(200).json({
			token: tokens?.accessToken,
			user: {
				_id: user._id,
				name: user.name,
				roles: user.roles,
			},
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find();

		return res.status(200).json(users);
	} catch (error) {
		return res
			.status(400)
			.json({ message: 'Не удалось получить пользователей' });
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res.status(401).json({ message: 'Пользователь не авторизован' });
		}

		const userData = validationRefreshToken(refreshToken);
		const tokenFromDB = await findTokenInDB(refreshToken);

		if (!userData || !tokenFromDB) {
			return res.status(401).json({ message: 'Пользователь не авторизован' });
		}

		const user = await User.findById(userData._id);

		const payload: JWTTypes = {
			_id: user._id,
			roles: user.roles,
		};
		const tokens = generateTokens(payload);

		if (tokens?.refreshToken) {
			await saveRefreshToken(user._id, tokens.refreshToken);

			res.cookie('refreshToken', tokens.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
		}

		return res.status(200).json({
			token: tokens?.accessToken,
			user: {
				_id: user._id,
				name: user.name,
				roles: user.roles,
			},
		});
	} catch (error) {
		return res.status(400).json({ message: 'Ошибка' });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.cookies;

		await deleteRefreshToken(refreshToken);
		res.clearCookie('refreshToken');

		return res
			.status(200)
			.json({ message: 'Вы вышли с аккаунта' })
			.redirect(`${process.env.CLIENT_URL}/rest-admin`);
	} catch (error) {
		return res
			.status(400)
			.json({ message: 'Произошла ошибка, не удалось выйти' });
	}
};
