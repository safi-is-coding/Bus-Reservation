const cloudinary = require('cloudinary').v2;
const path = require("path");
const fs = require("fs");

// Cloudinary configuration (best placed in the main server file, not every function)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Function to upload the image to Cloudinary
exports.uploadOnCloudinary = async (localFilePath) => {
    try {
        // Resolve the full path to the file
        const fullPath = path.resolve(localFilePath);
        console.log("Full path -> " + fullPath);

        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(fullPath, {
            resource_type: "auto" 
        });

        // After successful upload, remove the file from the local file system
        fs.unlinkSync(fullPath);

        console.log("Upload result:", uploadResult);
        return uploadResult.url; // Return the Cloudinary image URL
    } catch (error) {
        console.error("Error during Cloudinary upload:", error);

        // Remove the file if it exists, in case the upload failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw new Error("Failed to upload image to Cloudinary");
    }
};
