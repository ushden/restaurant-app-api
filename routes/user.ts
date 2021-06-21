import express from 'express';
import { check } from 'express-validator';

import {
	registration,
	adminLogin,
	getUsers,
	refreshToken,
	logout,
} from '../controllers/user';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleMiddleware } from '../middleware/roleMiddleware';

const router = express.Router();

router.post(
	'/registration',
	[
		check('name', 'Это поле не может быть пустым').notEmpty(),
		check('name', 'Минимум 3 символа').isLength({ min: 3 }),
		check('name', 'Максимум 10 символов').isLength({ max: 10 }),
		check('password', 'Минимум 8 символов').isLength({ min: 8 }),
	],
	registration
);
router.post('/adminLogin', adminLogin);
router.get('/refresh', authMiddleware, refreshToken);
router.get('/logout', authMiddleware, logout);
router.get('/getUsers', roleMiddleware(['ADMIN']), getUsers);

export default router;
