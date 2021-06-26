import { Request, Response } from 'express';
import Dishes from '../modules/dishes';
import DishesType from '../modules/dishesType';

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

export const addDishesType = async (req: Request, res: Response) => {
	const { value } = req.body;

	try {
		const isExist = await DishesType.findOne({ value });

		if (isExist) {
			return res.status(400).json({ message: 'Такая категория существует' });
		}

		const newType = new DishesType({ value });

		await newType.save();

		res
			.status(200)
			.json({ message: 'Категория успешно создана', type: newType });
	} catch (error) {
		res.status(400).json({ message: 'Не удалось создать тип блюда' });
	}
};

export const getDishesTypes = async (req: Request, res: Response) => {
	try {
		const category = await DishesType.find();

		res.status(200).json(category);
	} catch (error) {
		res.status(400).json({ message: 'Не удалось загрузить категории' });
	}
};
