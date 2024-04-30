import multer from "multer";
import fs from "fs";
import path from "path";
import { NextFunction } from "express";

export const setStorage = (path: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        },
    });
}

// Configure multer storage and file name
const storage = setStorage("uploads/exam-item");


// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (request: any, response: any, next: NextFunction) => {
	// Use multer upload instance
	upload.array("files", 5)(request, response, (err) => {
		if (err) {
			return response.status(400).json({ error: err.message });
		}

		// Retrieve uploaded files
		const files = request.files;
		const errors: any = [];

		// Validate file types and sizes
		files.forEach((file: any) => {
			const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
			const maxSize = 5 * 1024 * 1024; // 5MB

			if (!allowedTypes.includes(file.mimetype)) {
				errors.push(`Invalid file type: ${file.originalname}`);
			}

			if (file.size > maxSize) {
				errors.push(`File too large: ${file.originalname}`);
			}
		});

		// Handle validation errors
		if (errors.length > 0) {
			// Remove uploaded files
			files.forEach((file: any) => {
				fs.unlinkSync(file.path);
			});

			return response.status(400).json({ errors });
		}

		// Attach files to the request object
		request.files = files;

		// Proceed to the next middleware or route handler
		next();
	});
};


export default uploadMiddleware;