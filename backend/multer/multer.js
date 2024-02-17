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
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true); 
  } else {
    cb(new Error('Only JPEG and PNG files are allowed'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
