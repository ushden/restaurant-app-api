import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
	name: { type: String, unique: true, require: true },
	password: { type: String, require: true },
	roles: [{ type: String, ref: 'Role' }],
});

const User = mongoose.model('User', userSchema);

export default User;
