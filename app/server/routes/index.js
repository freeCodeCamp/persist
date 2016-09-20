import path from 'path';
import multer from 'multer';
import saveCSV from '../utils/save_csv';
import student from '../models/student';

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

	app.post('/upload', fileUpload, function(req, res) {
			console.log(req.files);
			console.log(req.files.file[0])

			const fileData = req.files.file[0];

			const filePath = path.join(fileData.destination, fileData.filename);
			console.log(filePath);

			saveCSV(filePath).then((data) => {
				res.status(200).send(data);
			}).catch((err) => {
				console.log(err);
				res.status(500).send(err);
			});
	});

	// main REST API for getting/adding/deleting/modifying student data
	app.route('/api/student/:contactID')
		.get((req, res) => {
			console.log(req.params.contactID);
			student.find({contactID: req.params.contactID }, (err, student) => {
				if (err) {
					res.status(500).send(err);
				}
				res.status(200).json(student);
			});
		})
		.post((req, res) => {
			res.send('working on it');
		})
		.put((req, res) => {
			res.send("working on it");
		})
		.delete((req, res) => {
			res.send("working on it");
		});

	// main routes for queries to students db - e.g. get per school, get certain category e.t.c.
	app.get('/api/students', (req, res) => {

		console.log(req.query);
		student.find({}, (err, students) => {
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(students);
		});
	});

	app.get('/*', (req, res) => {
		res.sendFile(path.join(__dirname, '../../client/public/index.html'));
	});	
};
