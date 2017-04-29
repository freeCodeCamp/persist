import path from 'path';
import multer from 'multer';
import rimraf from 'rimraf';
import { Student, College, School, User } from '../models';
import forOwn from 'lodash/forOwn';
import omit from 'lodash/omit';
import passport from '../config/passport';
import { getRole, ROLE_COUNSELOR, ROLE_OWNER, ROLE_ADMIN } from '../../common/constants';
import {
    DataManageController,
    AmazonController,
    AuthController,
    DocController,
    NotificationController,
    UserController,
    CaseNoteController,
    ApplicationController,
    TermController,
    UploadHistoryController,
    AliasController
} from '../controllers';
import saveCSV from '../utils/save_csv';
import saveCollegeData from '../utils/save_csv_colleges_updated';
import saveTermData from '../utils/save_csv_term_data';
import saveApplicationData from '../utils/save_csv_applications';
import saveSchoolData from '../utils/save_csv_schools';

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
var fileUpload = upload.fields([
    {
        name: 'file',
        maxCount: 1
    }
]);

const requireAuth = passport.authenticate('jwt', {
    session: false
});

const matchSecret = (req, res, next) => {
    const secret = req.body.secret;
    if (secret && secret === process.env.SECRET) {
        return next();
    }
    res.status(402).json({ error: 'You are not authorized.' });
};

const requireLogin = (req, res, next) => {
    passport.authenticate(
        'local',
        {
            session: false
        },
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(403).json({ message: info.error });
            }
            req.user = user;
            next();
        }
    )(req, res, next);
};

export default app => {
    app.post('/upload/studentData', requireAuth, AuthController.roleAuthorization('Owner'), fileUpload, function(req, res) {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCSV(filePath)
            .then(data => {
                UploadHistoryController.createHistory('Student Data', req.user._id, true);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                UploadHistoryController.createHistory('Student Data', req.user._id, false);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(500).send(err);
            });
    });

    app.post('/upload/collegeData', requireAuth, AuthController.roleAuthorization('Owner'), fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveCollegeData(filePath)
            .then(data => {
                UploadHistoryController.createHistory('College Data', req.user._id, true);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                UploadHistoryController.createHistory('College Data', req.user._id, false);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(500).send(err);
            });
    });

    app.post('/upload/schoolData', requireAuth, AuthController.roleAuthorization('Owner'), fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveSchoolData(filePath)
            .then(data => {
                UploadHistoryController.createHistory('School Data', req.user._id, true);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                UploadHistoryController.createHistory('School Data', req.user._id, false);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(500).send(err);
            });
    });

    app.post('/upload/termData', requireAuth, AuthController.roleAuthorization('Owner'), fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveTermData(filePath)
            .then(data => {
                UploadHistoryController.createHistory('Term Data', req.user._id, true);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                UploadHistoryController.createHistory('Term Data', req.user._id, false);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(500).send(err);
            });
    });

    app.post('/upload/applicationData', requireAuth, AuthController.roleAuthorization('Owner'), fileUpload, (req, res) => {
        const fileData = req.files.file[0];
        const filePath = path.join(fileData.destination, fileData.filename);

        saveApplicationData(filePath)
            .then(data => {
                UploadHistoryController.createHistory('Application Data', req.user._id, true);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(200).send(data);
            })
            .catch(err => {
                console.log(err);
                UploadHistoryController.createHistory('Application Data', req.user._id, false);
                rimraf('uploads/*', () => console.log('cleared'));
                res.status(500).send(err);
            });
    });

    // main REST API for getting/adding/deleting/modifying student data
    app
        .route('/api/student/:osis')
        .get((req, res) => {
            Student.findOne(
                {
                    osis: req.params.osis
                },
                (err, student) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    res.status(200).json(student);
                }
            );
        })
        .post((req, res) => {
            res.send('working on it');
        })
        .put((req, res) => {
            const student = omit(req.body, '_id');
            Student.findOne(
                {
                    osis: student.osis
                },
                (err, oldStudent) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    forOwn(student, (value, key) => {
                        oldStudent[key] = student[key];
                    });
                    oldStudent.save((err, updatedStudent) => {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        res.status(200).send(updatedStudent);
                    });
                }
            );
        })
        .delete((req, res) => {
            res.send('working on it');
        });

    app
        .route('/api/college/:fullName')
        .get((req, res) => {
            College.find(
                {
                    fullName: req.params.fullName
                },
                (err, college) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    res.status(200).json(college);
                }
            );
        })
        .post((req, res) => {
            res.send('working on it');
        })
        .put((req, res) => {
            const college = omit(req.body, '_id');
            College.findOne(
                {
                    fullName: college.fullName
                },
                (err, oldCollege) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    forOwn(college, (value, key) => {
                        oldCollege[key] = college[key];
                    });
                    oldCollege.save((err, updatedCollege) => {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        res.status(200).send(updatedCollege);
                    });
                }
            );
        })
        .delete((req, res) => {
            res.send('working on it');
        });

    // main routes for queries to students db
    app.get('/api/students', requireAuth, (req, res) => {
        let query;
        if (getRole(req.user.access.role) < getRole(ROLE_COUNSELOR)) {
            return res.status(200).json([]);
        } else if (getRole(req.user.access.role) === getRole(ROLE_COUNSELOR)) {
            query = Student.find({ hs: req.user.access.school });
        } else if (getRole(req.user.access.role) >= getRole(ROLE_OWNER)) {
            query = Student.find({});
        }
        query.lean().exec((err, students) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(students);
        });
    });

    app.get('/api/users', requireAuth, (req, res) => {
        let query;
        if (getRole(req.user.access.role) < getRole(ROLE_COUNSELOR)) {
            return res.status(200).json([]);
        } else if (getRole(req.user.access.role) === getRole(ROLE_COUNSELOR)) {
            query = User.find({
                $or: [{ access: { school: req.user.access.school } }, { access: { role: ROLE_OWNER } }, { access: { role: ROLE_ADMIN } }]
            });
        } else if (getRole(req.user.access.role) >= getRole(ROLE_OWNER)) {
            query = User.find({});
        }
        query.select('profile email').lean().exec((err, users) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(users);
        });
    });

    // main route for to get colleges db
    app.get('/api/colleges', requireAuth, (req, res) => {
        let query = College.find({});
        query.lean().exec((err, colleges) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(colleges);
        });
    });

    app.get('/api/schools', requireAuth, (req, res) => {
        let query = School.find({});
        query.lean().exec((err, schools) => {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(schools);
        });
    });

    app.get('/sign-s3', requireAuth, (req, res) => {
        AmazonController.getSign(req, res);
    });

    app
        .route('/update-document', requireAuth)
        .post((req, res) => {
            DocController.updateDocument(req, res);
        })
        .delete((req, res) => {
            DocController.deleteDocument(req, res);
        });

    app
        .route('/update-caseNote', requireAuth)
        .post((req, res) => {
            CaseNoteController.updateCaseNote(req, res);
        })
        .delete((req, res) => {
            CaseNoteController.deleteCaseNote(req, res);
        });

    app
        .route('/update-application', requireAuth)
        .post((req, res) => {
            ApplicationController.updateApplication(req, res);
        })
        .delete((req, res) => {
            ApplicationController.deleteApplication(req, res);
        });

    app
        .route('/update-term', requireAuth)
        .post((req, res) => {
            TermController.updateTerm(req, res);
        })
        .delete((req, res) => {
            TermController.deleteTerm(req, res);
        });

    app
        .route('/update-alias', requireAuth)
        .post((req, res) => {
            AliasController.updateAlias(req, res);
        })
        .delete((req, res) => {
            AliasController.deleteAlias(req, res);
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
    app.post('/reset-password/:token', AuthController.verifyToken);

    app.post('/backup-database', matchSecret, DataManageController.backupDatabase);
    app.post('/restore-database', requireAuth, AuthController.roleAuthorization('Owner'), DataManageController.restoreDatabase);
    app.get('/get-database-backups', requireAuth, AuthController.roleAuthorization('Owner'), DataManageController.getDatabaseBackups);

    app.post('/notifications', requireAuth, NotificationController.getNotifications);
    app.get('/notifications/read/all', requireAuth, NotificationController.allRead);
    app.post('/notifications/read', requireAuth, NotificationController.markRead);

    app.get('/getUploadHistory/:page', requireAuth, UploadHistoryController.getHistory);
    // final route
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/public/index.html'));
    });
};
