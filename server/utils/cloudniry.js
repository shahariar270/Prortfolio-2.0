const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadImage = async (filePath, folder = 'portfolio_posts', resourceType = 'auto') => {
    if (!filePath) return null;
    try {
        const ext = path.extname(filePath).toLowerCase();
        const isDocument = ['.pdf', '.doc', '.docx', '.zip'].includes(ext);
        const finalResourceType = isDocument ? 'raw' : resourceType;

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: finalResourceType,
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
