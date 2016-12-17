import path from 'path';
import multer from 'multer';
import express from 'express';
import Student from '../models/student';
import college from '../models/college';
import school from '../models/school';
import passport from '../config/passport';
import {
    DataManageController,
    AmazonController,
    AuthController,
    DocController,
    UserController
} from '../controllers';
import saveCSV from '../utils/save_csv';
import saveCollegeData from '../utils/save_csv_colleges_updated';
import saveTermData from '../utils/save_csv_term_data';
import saveApplicationData from '../utils/save_csv_applications';

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

const requireAuth = passport.authenticate('jwt', {
    session: false
});

const matchSecret = (req, res, next) => {
    const secret = req.body.secret;
    if (secret && secret === process.env.SECRET) {
        return next();
    }
    res.status(402).json({error: 'You are not authorized.'});
};

const requireLogin = (req, res, next) => {
    passport.authenticate('local', {
        session: false
    }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).json({message: info.error});
        }
        req.user = user;
        next();
    })(req, res, next);
};

export default (app) => {

    app.post('/studentPaginate', (req, res) => {
        const offset = req.body.offset;
        Student.paginate({}, {
            offset: offset,
            limit: 20
        }, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send(result.docs);
        });
    });

    app.post('/upload/studentData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCSV(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    });

    app.post('/upload/collegeData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCollegeData(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    });

    app.post('/upload/termData', fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveTermData(filePath).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        })
    });

    app.post('/upload/applicationData', fileUpload, function (req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        res.send('getting through ok')

        // saveApplicationData(filePath).then((data) => {
        //   res.status(200).send(data);
        // }).catch((err) => {
        //   console.log(err);
        //   res.status(500).send(err);
        // });
    });

    // main REST API for getting/adding/deleting/modifying student data
    app.route('/api/student/:osis')
        .get((req, res) => {
            Student.findOne({
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
            const student = req.body;
            Student.findOneAndUpdate({
                osis: student.osis
            }, {
                $set: student
            }, {
                new: true,
                runValidators: true
            }, (err, updatedStudent) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(200).send(updatedStudent);
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
                    return;
                }
                res.status(200).json(college);
            });
        })
        .post((req, res) => {
            res.send('working on it');
        })
        .put((req, res) => {

            const data = req.body;

            college.findOneAndUpdate({
                fullName: data.fullName
            }, {
                $set: data
            }, {
                new: true
            }, function (err, doc) {
                if (err) {
                    res.send({err: true});
                }
                res.send(doc);
            });
        })
        .delete((req, res) => {
            res.send('working on it');
        });

    // main routes for queries to students db
    app.get('/api/students', requireAuth, (req, res) => {

        let query = Student.find({});
        query.exec((err, students) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(students);
        });
    });

    // main route for to get colleges db
    app.get('/api/colleges', requireAuth, (req, res) => {

        let query = college.find({});
        query.exec((err, colleges) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(colleges);
        });
    });

    app.get('/api/schools', requireAuth, (req, res) => {

        let query = school.find({});
        query.exec((err, schools) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(schools);
        });
    });

    app.get('/sign-s3', requireAuth, (req, res) => {
        AmazonController.getSign(req, res);
    });

    app.route('/update-document', requireAuth)
        .post((req, res) => {
            DocController.updateDocument(req, res);
        })
        .delete((req, res) => {
            DocController.deleteDocument(req, res);
        });

    app.post('/register', AuthController.register);
    app.post('/login', requireLogin, AuthController.login);
    app.post('/forgot-password', AuthController.forgotPassword);
    app.get('/users', requireAuth, AuthController.roleAuthorization('Owner'), UserController.getUsers);
    app.post('/users', requireAuth, AuthController.roleAuthorization('Owner'), UserController.inviteUser);
    app.patch('/users', requireAuth, AuthController.roleAuthorization('Owner'), UserController.updateUser);
    app.delete('/users', requireAuth, AuthController.roleAuthorization('Owner'), UserController.deleteUser);
    app.post('/update-password/:token', AuthController.verifyToken);
    app.post('/invite/:token', AuthController.verifyToken);

    app.post('/backup-database', matchSecret, DataManageController.backupDatabase);
    app.post('/restore-database', requireAuth, AuthController.roleAuthorization('Owner'), DataManageController.restoreDatabase);
    app.get('/get-database-backups', requireAuth, AuthController.roleAuthorization('Owner'), DataManageController.getDatabaseBackups);

    // final route
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });
};
