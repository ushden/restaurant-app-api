import express from 'express';

import { addDishes, getAllDishes, getDish } from '../controllers/dishes';

const router = express.Router();

router.get('/', getAllDishes);
router.get('/:dishId', getDish);
router.post('/add', addDishes);

export default router;
