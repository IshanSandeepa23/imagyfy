import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"

// Example usage in a controller
import cloudinary from '../utils/cloudinary.js';

const uploadImage = async (req, res) => {
  try {
    // Assuming you have the image file in req.file.path (using multer or similar)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'your_folder', // optional
    });
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.userId; // get from auth middleware

        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({ success: false, message: 'No Credit Balance', creditBalance: user.creditBalance });
        }

        const fromData = new FormData();
        fromData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', fromData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.json({ success: true, message: "Image Generated", creditBalance: user.creditBalance - 1, resultImage });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}