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
