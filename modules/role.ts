import mongoose from 'mongoose';
const { Schema } = mongoose;

const roleSchema = new Schema({
	value: { type: String, unique: true, default: 'USER' },
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
