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
/* istanbul ignore next*/
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

/* istanbul ignore next*/
const matchSecret = (req, res, next) => {
    const secret = req.body.secret;
    if (secret && secret === process.env.SECRET) {
        return next();
    }
    res.status(402).json({ error: 'You are not authorized.' });
};

/* istanbul ignore next*/
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
    // TODO There's a lot of repeated code here in the /upload routes that can probably
    // be refactored into a single reusable method after tests are done for these routes.
    // Something like:
    // function handleUpload(type) {
    //    ... logic ...
    //    return function (req, res) {
    //      ...
    //    }
    // }

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
            Student.findOne({ osis: req.params.osis })
                .then(student => {
                    if (student === null) {
                        res.status(404).send();
                    } else {
                        res.status(200).json(student);
                    }
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .post((req, res) => {
            // FIXME Should this be implemented?  If not, can it be removed?
            res.send('working on it');
        })
        .put((req, res) => {
            const student = omit(req.body, '_id');
            Student.findOne({ osis: req.params.osis })
                .then(oldStudent => {
                    if (oldStudent === null) {
                        res.status(404).send();
                    } else {
                        forOwn(student, (value, key) => {
                            oldStudent[key] = student[key];
                        });
                        oldStudent
                            .save()
                            .then(updatedStudent => {
                                res.status(200).send(updatedStudent);
                            })
                            .catch(err => {
                                res.status(500).send(err);
                            });
                    }
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .delete((req, res) => {
            // FIXME should this be implemented?  if not, can it be removed?
            res.send('working on it');
        });

    app
        .route('/api/college/:fullName')
        .get((req, res) => {
            // NOTE The GET request on this route seems to be unusued anywhere in the codebase.
            // I changed the query from find to findOne in order to be more consistent with
            // other similar routes.  This obviously changes the returned JSON from an array
            // with a single element to a single object.  As the route is unused this SHOULD
            // not cause a problem.  This should be tested more thoroughly though before
            // pushing to production.
            College.findOne({ fullName: req.params.fullName })
                .then(college => {
                    if (college === null) {
                        return res.status(404).send();
                    }
                    res.status(200).json(college);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .post((req, res) => {
            // FIXME should this be implemented?  if not, can it be removed?
            res.send('working on it');
        })
        .put((req, res) => {
            const college = omit(req.body, '_id');
            College.findOne({ fullName: req.params.fullName })
                .then(oldCollege => {
                    if (oldCollege === null) {
                        res.status(404).send();
                    } else {
                        forOwn(college, (value, key) => {
                            oldCollege[key] = college[key];
                        });
                        oldCollege
                            .save()
                            .then(updatedCollege => {
                                res.status(200).send(updatedCollege);
                            })
                            .catch(err => {
                                res.status(500).send(err);
                            });
                    }
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .delete((req, res) => {
            // FIXME should this be implemented?  if not, can it be removed?
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
        query
            .lean()
            .exec()
            .then(students => {
                res.status(200).json(students);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    app.get('/api/users', requireAuth, (req, res) => {
        let query;
        if (getRole(req.user.access.role) < getRole(ROLE_COUNSELOR)) {
            return res.status(200).json([]);
        } else if (getRole(req.user.access.role) === getRole(ROLE_COUNSELOR)) {
            query = User.find({
                $or: [{ 'access.school': req.user.access.school }, { access: { role: ROLE_OWNER } }, { access: { role: ROLE_ADMIN } }]
            });
        } else if (getRole(req.user.access.role) >= getRole(ROLE_OWNER)) {
            query = User.find({});
        }
        query
            .select('profile email')
            .lean()
            .exec()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    // main route for to get colleges db
    app.get('/api/colleges', requireAuth, (req, res) => {
        let query = College.find({});
        query
            .lean()
            .exec()
            .then(colleges => {
                res.status(200).json(colleges);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });

    app.get('/api/schools', requireAuth, (req, res) => {
        let query = School.find({});
        query
            .lean()
            .exec()
            .then(schools => {
                res.status(200).json(schools);
            })
            .catch(err => {
                res.status(500).send(err);
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
    app.patch('/user_name', requireAuth, UserController.updateUserName);
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
