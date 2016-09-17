import path from 'path';

//import multer
var multer  = require('multer');

//set disk storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
});

//configure multer middleware
var fileUpload = upload.fields([{ name: 'file', maxCount: 1 }])

module.exports = function(app) {

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../client/public/index.html'));
	});

	app.post('/upload', fileUpload, function(req, res) {
			console.log(req.files);
			//req.files.file[0]
			res.send("working");	
	});
}