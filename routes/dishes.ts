import express from 'express';

import {
	addDishes,
	getAllDishes,
	getDish,
	addDishesType,
	getDishesTypes,
} from '../controllers/dishes';

const router = express.Router();

router.post('/addType', addDishesType);
router.get('/getTypes', getDishesTypes);

router.get('/', getAllDishes);
router.get('/:dishId', getDish);
router.post('/add', addDishes);

export default router;
