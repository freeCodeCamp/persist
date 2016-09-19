import path from 'path';
import multer from 'multer';

var upload = multer({ dest: 'uploads/' });

// set disk storage
var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },

  filename(req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  }
});

// configure multer middleware
var fileUpload = upload.fields([{ name: 'file', maxCount: 1 }]);

export default (app) => {

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../client/public/index.html'));
	});

	app.post('/upload', fileUpload, function(req, res) {
			console.log(req.files);
			// req.files.file[0]
			setTimeout(function() {
				res.send('working')}, 5000);
	});
};
