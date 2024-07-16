import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

export const connectDB = async () => {
    const URI = process.env.MONGODB_URI;

    try {
        await mongoose.connect(URI);
        console.log("DB is connected");
    } catch (error) {
        console.log('Error connecting to DB:', error);
    }
};
