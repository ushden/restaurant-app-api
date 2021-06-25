import { Request, Response } from 'express';
import Dishes from '../modules/dishes';

export const getAllDishes = async (req: Request, res: Response) => {
	try {
		const dishes = await Dishes.find();

		res.status(200).json(dishes);
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

export const getDish = async (req: Request, res: Response) => {
	try {
		const { dishId } = req.params;

		const dish = await Dishes.findById({ _id: dishId });

		if (dish) {
			return res.status(200).json({ dish });
		}

		return res.status(401).json({ message: 'Блюдо не найдено' });
	} catch (error) {
		res.status(400).json({ message: 'Не удалось загрузить блюдо' });
	}
};

export const addDishes = async (req: Request, res: Response) => {
	const { dishes } = req.body;
	const { image, name, weight, price, ingredients, type } = dishes;

	const newDishes = new Dishes(dishes);
	try {
		await newDishes.save();

		res.status(201).json(newDishes);
	} catch (error) {
		res.status(409).json({ message: error.message });
	}
};
