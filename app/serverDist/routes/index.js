"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _models = require("../models");

var _passport = require("../config/passport");

var _passport2 = _interopRequireDefault(_passport);

var _constants = require("../../common/constants");

var _controllers = require("../controllers");

var _save_csv = require("../utils/save_csv");

var _save_csv2 = _interopRequireDefault(_save_csv);

var _save_csv_colleges_updated = require("../utils/save_csv_colleges_updated");

var _save_csv_colleges_updated2 = _interopRequireDefault(_save_csv_colleges_updated);

var _save_csv_term_data = require("../utils/save_csv_term_data");

var _save_csv_term_data2 = _interopRequireDefault(_save_csv_term_data);

var _save_csv_applications = require("../utils/save_csv_applications");

var _save_csv_applications2 = _interopRequireDefault(_save_csv_applications);

var _save_csv_schools = require("../utils/save_csv_schools");

var _save_csv_schools2 = _interopRequireDefault(_save_csv_schools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)({
    dest: 'uploads/'
});

// set disk storage
var storage = _multer2.default.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function filename(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

// configure multer middleware
var fileUpload = upload.fields([{
    name: 'file',
    maxCount: 1
}]);

var requireAuth = _passport2.default.authenticate('jwt', {
    session: false
});

var matchSecret = function matchSecret(req, res, next) {
    var secret = req.body.secret;
    if (secret && secret === process.env.SECRET) {
        return next();
    }
    res.status(402).json({ error: 'You are not authorized.' });
};

var requireLogin = function requireLogin(req, res, next) {
    _passport2.default.authenticate('local', {
        session: false
    }, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).json({ message: info.error });
        }
        req.user = user;
        next();
    })(req, res, next);
};

exports.default = function (app) {

    app.post('/upload/studentData', requireAuth, fileUpload, function (req, res) {
        var fileData = req.files.file[0];
        var filePath = _path2.default.join(fileData.destination, fileData.filename);

        (0, _save_csv2.default)(filePath).then(function (data) {
            _controllers.UploadHistoryController.createHistory('Student Data', req.user._id, true);
            res.status(200).send(data);
        }).catch(function (err) {
            console.log(err);
            _controllers.UploadHistoryController.createHistory('Student Data', req.user._id, false);
            res.status(500).send(err);
        });
    });

    app.post('/upload/collegeData', requireAuth, fileUpload, function (req, res) {
        var fileData = req.files.file[0];
        var filePath = _path2.default.join(fileData.destination, fileData.filename);

        (0, _save_csv_colleges_updated2.default)(filePath).then(function (data) {
            _controllers.UploadHistoryController.createHistory('College Data', req.user._id, true);
            res.status(200).send(data);
        }).catch(function (err) {
            console.log(err);
            _controllers.UploadHistoryController.createHistory('College Data', req.user._id, false);
            res.status(500).send(err);
        });
    });

    app.post('/upload/schoolData', requireAuth, fileUpload, function (req, res) {
        var fileData = req.files.file[0];
        var filePath = _path2.default.join(fileData.destination, fileData.filename);

        (0, _save_csv_schools2.default)(filePath).then(function (data) {
            _controllers.UploadHistoryController.createHistory('School Data', req.user._id, true);
            res.status(200).send(data);
        }).catch(function (err) {
            console.log(err);
            _controllers.UploadHistoryController.createHistory('School Data', req.user._id, false);
            res.status(500).send(err);
        });
    });

    app.post('/upload/termData', requireAuth, fileUpload, function (req, res) {
        var fileData = req.files.file[0];
        var filePath = _path2.default.join(fileData.destination, fileData.filename);

        (0, _save_csv_term_data2.default)(filePath).then(function (data) {
            _controllers.UploadHistoryController.createHistory('Term Data', req.user._id, true);
            res.status(200).send(data);
        }).catch(function (err) {
            console.log(err);
            _controllers.UploadHistoryController.createHistory('Term Data', req.user._id, false);
            res.status(500).send(err);
        });
    });

    app.post('/upload/applicationData', requireAuth, fileUpload, function (req, res) {
        var fileData = req.files.file[0];
        var filePath = _path2.default.join(fileData.destination, fileData.filename);

        (0, _save_csv_applications2.default)(filePath).then(function (data) {
            _controllers.UploadHistoryController.createHistory('Application Data', req.user._id, true);
            res.status(200).send(data);
        }).catch(function (err) {
            console.log(err);
            _controllers.UploadHistoryController.createHistory('Application Data', req.user._id, false);
            res.status(500).send(err);
        });
    });

    // main REST API for getting/adding/deleting/modifying student data
    app.route('/api/student/:osis').get(function (req, res) {
        _models.Student.findOne({
            osis: req.params.osis
        }, function (err, student) {
            if (err) {
                res.status(500).send(err);
            }
            console.log(student);
            res.status(200).json(student);
        });
    }).post(function (req, res) {
        res.send('working on it');
    }).put(function (req, res) {
        var student = req.body;
        _models.Student.findOneAndUpdate({
            osis: student.osis
        }, {
            $set: student
        }, {
            new: true,
            runValidators: true
        }, function (err, updatedStudent) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).send(updatedStudent);
        });
    }).delete(function (req, res) {
        res.send('working on it');
    });

    app.route('/api/college/:fullName').get(function (req, res) {
        console.log(req.params.fullName);
        _models.College.find({
            fullName: req.params.fullName
        }, function (err, college) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(college);
        });
    }).post(function (req, res) {
        res.send('working on it');
    }).put(function (req, res) {

        var data = req.body;

        _models.College.findOneAndUpdate({
            fullName: data.fullName
        }, {
            $set: data
        }, {
            new: true
        }, function (err, doc) {
            if (err) {
                res.send({ err: true });
            }
            res.send(doc);
        });
    }).delete(function (req, res) {
        res.send('working on it');
    });

    // main routes for queries to students db
    app.get('/api/students', requireAuth, function (req, res) {
        var query = void 0;
        if ((0, _constants.getRole)(req.user.access.role) < (0, _constants.getRole)(_constants.ROLE_COUNSELOR)) {
            return res.status(200).json([]);
        } else if ((0, _constants.getRole)(req.user.access.role) === (0, _constants.getRole)(_constants.ROLE_COUNSELOR)) {
            query = _models.Student.find({ hs: req.user.access.school });
        } else if ((0, _constants.getRole)(req.user.access.role) > (0, _constants.getRole)(_constants.ROLE_OWNER)) {
            query = _models.Student.find({});
        }
        query.exec(function (err, students) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(students);
        });
    });

    app.get('/api/users', requireAuth, function (req, res) {
        var query = void 0;
        if ((0, _constants.getRole)(req.user.access.role) < (0, _constants.getRole)(_constants.ROLE_COUNSELOR)) {
            return res.status(200).json([]);
        } else if ((0, _constants.getRole)(req.user.access.role) === (0, _constants.getRole)(_constants.ROLE_COUNSELOR)) {
            query = _models.User.find({
                $or: [{ access: { school: req.user.access.school } }, { access: { role: _constants.ROLE_OWNER } }, { access: { role: _constants.ROLE_ADMIN } }]
            });
        } else if ((0, _constants.getRole)(req.user.access.role) > (0, _constants.getRole)(_constants.ROLE_OWNER)) {
            query = _models.User.find({});
        }
        query.select('profile email').exec(function (err, users) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(200).json(users);
        });
    });

    // main route for to get colleges db
    app.get('/api/colleges', requireAuth, function (req, res) {

        var query = _models.College.find({});
        query.exec(function (err, colleges) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(colleges);
        });
    });

    app.get('/api/schools', requireAuth, function (req, res) {

        var query = _models.School.find({});
        query.exec(function (err, schools) {
            if (err) {
                res.status(500).send(err);
            }
            res.status(200).json(schools);
        });
    });

    app.get('/sign-s3', requireAuth, function (req, res) {
        _controllers.AmazonController.getSign(req, res);
    });

    app.route('/update-document', requireAuth).post(function (req, res) {
        _controllers.DocController.updateDocument(req, res);
    }).delete(function (req, res) {
        _controllers.DocController.deleteDocument(req, res);
    });

    app.route('/update-caseNote', requireAuth).post(function (req, res) {
        _controllers.CaseNoteController.updateCaseNote(req, res);
    }).delete(function (req, res) {
        _controllers.CaseNoteController.deleteCaseNote(req, res);
    });

    app.route('/update-application', requireAuth).post(function (req, res) {
        _controllers.ApplicationController.updateApplication(req, res);
    }).delete(function (req, res) {
        _controllers.ApplicationController.deleteApplication(req, res);
    });

    app.route('/update-term', requireAuth).post(function (req, res) {
        _controllers.TermController.updateTerm(req, res);
    }).delete(function (req, res) {
        _controllers.TermController.deleteTerm(req, res);
    });

    app.post('/register', _controllers.AuthController.register);
    app.post('/login', requireLogin, _controllers.AuthController.login);
    app.post('/forgot-password', _controllers.AuthController.forgotPassword);
    app.get('/users', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.UserController.getUsers);
    app.post('/users', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.UserController.inviteUser);
    app.patch('/users', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.UserController.updateUser);
    app.delete('/users', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.UserController.deleteUser);
    app.post('/update-password/:token', _controllers.AuthController.verifyToken);
    app.post('/invite/:token', _controllers.AuthController.verifyToken);

    app.post('/backup-database', matchSecret, _controllers.DataManageController.backupDatabase);
    app.post('/restore-database', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.DataManageController.restoreDatabase);
    app.get('/get-database-backups', requireAuth, _controllers.AuthController.roleAuthorization('Owner'), _controllers.DataManageController.getDatabaseBackups);

    app.post('/notifications', requireAuth, _controllers.NotificationController.getNotifications);
    app.get('/notifications/read/all', requireAuth, _controllers.NotificationController.allRead);
    app.post('/notifications/read', requireAuth, _controllers.NotificationController.markRead);

    app.get('/getUploadHistory/:page', requireAuth, _controllers.UploadHistoryController.getHistory);
    // final route
    app.get('/*', function (req, res) {
        res.sendFile(_path2.default.join(__dirname, '../../client/public/index.html'));
    });
};