const multer = require('multer');

const uploadImages = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {
			console.log(file);
			callback(null, './public/images');
		},
		filename: function (req, file, callback) {
			console.log(file,"fileeeeee");
			file.originalname = Date.now() + '--' + file.originalname.replaceAll(' ', '_');
			if (req.filesPath) {
				req.filesPath = ['public/images/' + file.originalname, ...req.filesPath];
			} else req.filesPath = ['public/images/' + file.originalname];
			callback(null, file.originalname);
		},
	}),
}).single('file');

const multiUploadImages = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, './public/images');
		},
		filename: function (req, file, callback) {
			file.originalname = Date.now() + '--' + file.originalname.replaceAll(' ', '_');
			if (req.imagesPath) {
				req.imagesPath = ['public/images/' + file.originalname, ...req.imagesPath];
			} else req.imagesPath = ['public/images/' + file.originalname];
			callback(null, file.originalname);
		},
	}),
}).array('files', 20);


  module.exports={
	uploadImages,
	multiUploadImages
  }