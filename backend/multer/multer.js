const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../userFiles'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); 
  } else if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
  }
};

const photoLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB for photos
};

const pdfLimits = {
  fileSize: 10 * 1024 * 1024, // 10MB for PDF files
};

const photoUpload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: photoLimits,
});

const pdfUpload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: pdfLimits,
});

module.exports = { photoUpload, pdfUpload };
