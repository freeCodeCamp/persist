import parallel from 'async/parallel';
import mapLimit from 'async/mapLimit';
import _ from 'lodash';
import moment from 'moment';
import json2csv from 'json2csv';
import {Student, College, School} from '../models';
import {
    studentKeys,
    applicationKeys,
    collegeGraduationKeys,
    collegeKeys,
    termKeys
} from '../../common/fieldKeys';
import exportKeys from '../../common/exportKeys';
const studentKeysObj = _.keyBy(studentKeys, 'dbName');
const applicationKeysObj = _.keyBy(applicationKeys, 'dbName');
const collegeGraduationKeysObj = _.keyBy(collegeGraduationKeys, 'dbName');
const collegeKeysObj = _.keyBy(collegeKeys, 'dbName');
const termKeysObj = _.keyBy(termKeys, 'dbName');

const createModelObj = () => {
    let collegeObj, schoolObj;
    return new Promise((resolve, reject) => {
        parallel([
            (callback) => {
                College.find({}, (err, colleges) => {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    collegeObj = _.keyBy(colleges, '_id');
                    return callback(null);
                });
            },
            (callback) => {
                School.find({}, (err, schools) => {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    schoolObj = _.keyBy(schools, '_id');
                    return callback(null);
                });
            }
        ], (err) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve([collegeObj, schoolObj]);
        });
    })
};

export const exportStudentCSV = (req, res) => {
    const {fields, students} = req.body;
    const fieldTypes = exportKeys(fields);
    const fieldNames = fields.map((field) => {
        if (studentKeysObj[field]) {
            return studentKeysObj[field].fieldName
        }
        return 'Field not available';
    });
    const quotes = '';
    const doubleQuotes = '"';
    createModelObj()
        .then((modelObj) => {
            const collegeObj = modelObj[0];
            const schoolObj = modelObj[1];
            mapLimit(students, 100, (student, callback) => {
                fieldTypes['college'].forEach((field) => {
                    const studentField = student[field];
                    if (studentField && collegeObj[studentField]) {
                        student[field] = collegeObj[studentField].fullName;
                    }
                });
                fieldTypes['school'].forEach((field) => {
                    const studentField = student[field];
                    if (studentField && schoolObj[studentField]) {
                        student[field] = schoolObj[studentField].name;
                    }
                });
                fieldTypes['checkbox'].forEach((field) => {
                    const studentField = student[field];
                    student[field] = `"${studentField.join(',')}"`;
                });
                fieldTypes['datepicker'].forEach((field) => {
                    const studentField = student[field];
                    const dateString = moment(studentField).format('l');
                    if (dateString !== 'Invalid Date') {
                        student[field] = dateString;
                    }
                });
                process.nextTick(() => {
                    callback(null, student);
                });
            }, (err, finalData) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err || 'error in finding students');
                }
                const csv = json2csv({
                    data: finalData,
                    fields,
                    fieldNames,
                    quotes,
                    doubleQuotes
                }, (err, csvFile) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err || 'server error');
                    }
                    res.setHeader('Content-Type', 'application/octet-stream');
                    res.setHeader("Content-Disposition", 'attachment; filename=students.csv;');
                    res.status(200).end(csvFile, 'binary');
                });
            });
        })
        .catch((err) => {
            res.status(500).send(err || 'model not accessible');
        });
};

export default {
    exportStudentCSV
};
