"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getHistory = exports.createHistory = undefined;

var _uploadHistory = require("../models/uploadHistory");

var _uploadHistory2 = _interopRequireDefault(_uploadHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createHistory = exports.createHistory = function createHistory(type, user, success) {
    _uploadHistory2.default.create({
        type: type,
        user: user,
        when: new Date(),
        success: success
    }, function (err) {
        if (err) {
            return console.log(err);
        }
    });
};

var getHistory = exports.getHistory = function getHistory(req, res) {
    var page = req.params.page || 1;
    _uploadHistory2.default.paginate({}, { sort: { when: -1 }, page: page, limit: 10 }).then(function (result) {
        res.status(200).json(result);
    }).catch(function (err) {
        res.status(500).send(err);
    });
};

exports.default = {
    createHistory: createHistory,
    getHistory: getHistory
};