import express from 'express';

import { addDishes, getAllDishes } from '../controllers/dishes';

const router = express.Router();

router.get('/', getAllDishes);
router.post('/add', addDishes);

export default router;
