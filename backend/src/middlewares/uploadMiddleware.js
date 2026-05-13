import multer from 'multer';

// Veriyi doğrudan Node belleğinde (RAM) tutarız.
// Böylece raw (ağır) fotoğrafı diske kaydetmeden doğrudan Sharp kütüphanesine paslayabiliriz.
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Yalnızca fotoğraf yükleyebilirsiniz!'), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB Maksimum
});
