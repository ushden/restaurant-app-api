import mongoose from 'mongoose';
const { Schema } = mongoose;

const dishesTypeSchema = new Schema({
	value: { type: String, unique: true, require: true },
});

const DishesType = mongoose.model('DishesType', dishesTypeSchema);

export default DishesType;
