const cloudinary = require('cloudinary').v2;
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadImage = async (filePath) => {
    if (!filePath) return null;
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'portfolio_posts',
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

module.exports = {
    uploadImage
};
