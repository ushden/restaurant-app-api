import { Dish } from '../types';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';

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

export const addDish = async (req: Request, res: Response) => {
	const dish = req.body as Dish;

	try {
		const isExist = await Dishes.findOne({ name: dish.name });

		if (isExist) {
			return res.status(400).json({ message: 'Такое блюдо уже существует' });
		}

		const newDish = await new Dishes(dish);

		await newDish.save();

		res.status(200).json({ message: 'Блюдо успешно создано', dish: newDish });
	} catch (error) {
		res.status(500).json({ message: 'Не удалось создать блюдо' });
	}
};

export const uploadImage = async (req: Request, res: Response) => {
	try {
		const image = req.files?.image as UploadedFile;
		const imagePath = path.resolve(__dirname, '..', 'static', image.name);

		image.mv(imagePath, (err) => {
			if (err) {
				return res.status(500).json({
					message: 'Не удалось загрузить изображение',
				});
			}

			return res.status(200).json({
				message: 'Изображение загружено успешно',
				name: image.name,
			});
		});
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось загрузить изображение',
		});
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

export const deleteDish = async (req: Request, res: Response) => {
	try {
		const { id } = req.body;

		const dish = await Dishes.findByIdAndDelete(id);

		res.status(200).json({ message: 'Блюдо успешно удалено', dish });
	} catch (error) {
		res.status(500).json({ message: 'Не удалось удалить блюдо' });
	}
};
