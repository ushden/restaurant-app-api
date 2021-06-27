import { roleMiddleware } from './../middleware/roleMiddleware';
import express from 'express';

import {
	addDish,
	getAllDishes,
	getDish,
	addDishesType,
	getDishesTypes,
	uploadImage,
	deleteDish,
} from '../controllers/dishes';

const router = express.Router();

// Вынести типы в отдельный роут и написать отдельно контроллер и сервис
router.post('/addType', roleMiddleware(['ADMIN']), addDishesType);
router.get('/getTypes', getDishesTypes);

router.get('/', getAllDishes);
router.get('/:dishId', getDish);
router.post('/addDish', roleMiddleware(['ADMIN']), addDish);
router.delete('/deleteDish', roleMiddleware(['ADMIN']), deleteDish);

// Сделать отдлельную модель для изображений, создать раздел мультимедия в админке
router.post('/uploadImage', roleMiddleware(['ADMIN']), uploadImage);

export default router;
