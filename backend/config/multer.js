import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.zip', '.rar', '.7zip', '.txt'];
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Only .zip, .rar, .7zip, and .txt files are allowed'), false);
  }
  cb(null, true);
};

const imageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Only image files (.jpg, .jpeg, .png, .webp) are allowed'), false);
  }
  cb(null, true);
};

export const uploadProfileImage = multer({ storage, fileFilter: imageFileFilter });


const upload = multer({
  storage,
  fileFilter
});

// This is key! export this for routes expecting multiple file fields
export const uploadProblemFiles = upload.fields([
  { name: 'inputFiles', maxCount: 20 },
  { name: 'outputFiles', maxCount: 20 },
  { name: 'zipFile', maxCount: 1 }
]);

export default upload;
