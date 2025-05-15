import multer from 'multer' 
import path from 'path'

// Storage config: save files in 'uploads/' folder with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp-originalname
    //cb is used to follow the error first callback pattern
    // to handle errors in the callback
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
});

export default upload
