import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

import dishesRouter from './routes/dishes';
import userRouter from './routes/user';

dotenv.config();

const PORT = process.env.PORT || 4848;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gwsr8.mongodb.net/kitchen?retryWrites=true&w=majority`;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	})
);
app.use(fileUpload());

app.use('/api/dishes', dishesRouter);
app.use('/api/user', userRouter);

const startServer = async () => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		app.listen(PORT, () => console.log(`Server run in port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
};

startServer();

mongoose.set('useFindAndModify', false);
