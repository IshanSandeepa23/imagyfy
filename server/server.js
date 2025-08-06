import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';


const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());
await connectDB()

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req, res)=> res.send("API Working "));

app.listen(PORT, ()=> console.log('server running on port'+ PORT));


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;