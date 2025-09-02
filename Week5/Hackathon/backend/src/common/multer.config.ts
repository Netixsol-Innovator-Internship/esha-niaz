import { diskStorage } from 'multer';
import { extname } from 'path';

export const carImageStorage = diskStorage({
  destination: './uploads/cars', // folder where images will be stored
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});
