import multer from "multer";

// Use memory storage (so we can directly upload buffer to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("multer file", file)
  const allowedTypes = /jpeg|jpg|png|webp/;
  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// ✅ Export multer config
export const upload = multer({ storage, fileFilter });
