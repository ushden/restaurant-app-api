import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	refreshToken: { type: String, require: true },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
