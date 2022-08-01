const multer  = require('multer');
const types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    };
};

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './public/static/files');
    },
    filename(req, file, cb) {
        cb(null, Math.floor(Date.now() /1000).toString() + '-' + file.originalname);
    }
});

module.exports = multer({storage, fileFilter});