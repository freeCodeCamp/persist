import path from 'path';
import multer from 'multer';
import saveCSV from '../utils/save_csv';
import student from '../models/student';
import college from '../models/college';
import school from '../models/school';
import saveCollegeData from '../utils/save_csv_colleges';

var upload = multer({
  dest: 'uploads/'
});

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
var fileUpload = upload.fields([{
  name: 'file',
  maxCount: 1
}]);

export default (app) => {

  app.post('/studentPaginate', (req, res) => {
    const offset = req.body.offset;
    student.paginate({}, {
      offset: offset,
      limit: 20
    }, function(err, result) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).send(result.docs);
    });
  });

  app.post('/upload/studentData', fileUpload, function(req, res) {

    const fileData = req.files.file[0];

    const filePath = path.join(fileData.destination, fileData.filename);

    saveCSV(filePath).then((data) => {
      res.status(200).send(data);
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  });

  app.post('/upload/collegeData', fileUpload, function(req, res) {

    const fileData = req.files.file[0];

    const filePath = path.join(fileData.destination, fileData.filename);

    saveCollegeData(filePath).then((data) => {
      res.status(200).send(data);
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
  });

  // handle autocomplete
  app.post('/suggestions', (req, res) => {
    let columnName = req.body.columnName;
    let value = new RegExp('.*' + req.body.value + '.*', 'i');
    let find = {};
    find[columnName] = value;
    student
      .distinct(columnName, find)
      .exec((err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        res.send(data.splice(0, 5));
      });
  });

  // main REST API for getting/adding/deleting/modifying student data
  app.route('/api/student/:osis')
    .get((req, res) => {
      student.findOne({
        osis: req.params.osis
      }, (err, student) => {
        if (err) {
          res.status(500).send(err);
        }
        console.log(student);
        res.status(200).json(student);
      });
    })
    .post((req, res) => {
      res.send('working on it');
    })
    .put((req, res) => {



      console.log(req.body);
      const data = req.body;

      student.findOneAndUpdate({osis: data.osis}, {$set: data}, {new: true}, function(err, doc){
      if(err){
          console.log("Something wrong when updating data!");
      }

      console.log(doc);
      res.send(doc);
    });





      
    })
    .delete((req, res) => {
      res.send('working on it');
    });

  app.route('/api/college/:fullName')
    .get((req, res) => {
      console.log(req.params.fullName);
      college.find({
        fullName: req.params.fullName
      }, (err, college) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).json(college);
      });
    })
    .post((req, res) => {
      res.send('working on it');
    })
    .put((req, res) => {
      res.send('working on it');
    })
    .delete((req, res) => {
      res.send('working on it');
    });

  // main routes for queries to students db 
  app.get('/api/students', (req, res) => {

    console.log(req.query);

    let queryObject = req.query;
    let query = student.find(queryObject);

    query.exec((err, students) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(200).json(students);
    });
  });

  // main routes for queries to colleges db 
  app.get('/api/colleges', (req, res) => {

    console.log(req.query);

    let queryObject = req.query;
    let query = college.find(queryObject).limit(20);
    query.exec((err, colleges) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(colleges);
    });
  });

  app.get('/api/schools', (req, res) => {

    let query = school.find({});
    query.exec((err, schools) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(schools);
    });
  });

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
  });
};
