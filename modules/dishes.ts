import mongoose from 'mongoose';
const { Schema } = mongoose;

const dishesSchema = new Schema({
	image: String,
	name: String,
	weight: Number,
	price: Number,
	ingredients: String,
	type: { type: String, require: true, ref: 'DishesType' },
	rate: {
		type: Number,
		default: 5,
	},
});

const Dishes = mongoose.model('Dishes', dishesSchema);

export default Dishes;
