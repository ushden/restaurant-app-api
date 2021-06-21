import jwt from 'jsonwebtoken';

import { JWTTypes } from '../types';
import TokenModel from '../modules/token';

export const generateTokens = (
	payload: JWTTypes
): { accessToken: string; refreshToken: string } | undefined => {
	const accessSecretKey = process.env.JWT_ACCESS_SECRET_KEY;
	const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;

	if (accessSecretKey && refreshSecretKey) {
		const accessToken = jwt.sign(payload, accessSecretKey, {
			expiresIn: '24h',
		});
		const refreshToken = jwt.sign(payload, refreshSecretKey, {
			expiresIn: '30d',
		});

		return {
			accessToken,
			refreshToken,
		};
	}
};

export const saveRefreshToken = async (
	userId: string,
	refreshToken: string
) => {
	try {
		const tokenData = await TokenModel.findOne({ user: userId });

		if (tokenData) {
			tokenData.refreshToken = refreshToken;

			return tokenData.save();
		}

		const token = await new TokenModel({
			user: userId,
			refreshToken,
		});

		await token.save();

		return token;
	} catch (error) {
		throw new Error('Не удалось сохранить рефреш токен');
	}
};

export const deleteRefreshToken = async (refreshToken: string) => {
	try {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	} catch (error) {
		throw new Error('Не удалось удалить токен');
	}
};

export const validationRefreshToken = (refreshToken: string) => {
	try {
		const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;

		if (refreshSecretKey) {
			const tokenPayload = jwt.verify(refreshToken, refreshSecretKey);

			return tokenPayload as JWTTypes;
		}
	} catch (error) {
		return null;
	}
};

export const validationAccessToken = (accessToken: string) => {
	try {
		const accessSecretKey = process.env.JWT_ACCESS_SECRET_KEY;

		if (accessSecretKey) {
			const tokenPayload = jwt.verify(accessToken, accessSecretKey);

			return tokenPayload as JWTTypes;
		}
	} catch (error) {
		return null;
	}
};

export const findTokenInDB = async (refreshToken: string) => {
	try {
		const token = await TokenModel.findOne({ refreshToken });

		return token;
	} catch (error) {
		return null;
	}
};
