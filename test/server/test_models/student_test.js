const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const { ObjectID } = require('mongodb');
const validator = require('../../../app/common/validator');
const { map, every } = require('lodash');
const { testModel } = require('../testUtils');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('student', () => {
    const { enums } = validator;

    it('should require a unique osis value', done => {
        const validStudents = [
            { osis: 1 } // Unused value
        ];
        const invalidStudents = [
            { osis: 1 } // Duplicate value
        ];

        testModel(dbModels.Student, validStudents, invalidStudents, done);
    });

    it('should only allow an ethnicity integer in range [1,7]', done => {
        const validStudents = [{ ethnicity: 1, osis: 1 }, { ethnicity: 7, osis: 2 }];
        const invalidStudents = [{ ethnicity: 0, osis: 3 }, { ethnicity: 8, osis: 4 }];

        testModel(dbModels.Student, validStudents, invalidStudents, done);
    });

    it('should generate hsGradYear based on hsGradDate', done => {
        const validStudents = [
            { hsGradDate: new Date('2014-09-15T00:00:00.000Z'), osis: 1 },
            { hsGradDate: new Date('2015-09-15T00:00:00.000Z'), osis: 2 },
            { hsGradDate: new Date('2016-09-15T00:00:00.000Z'), osis: 3 }
        ];

        const saveStudent = doc =>
            new dbModels.Student(doc)
                .save()
                .then(res => res)
                .catch(done);
        const verifyStudent = doc => {
            expect(doc.hsGradYear).toExist();
            expect(doc.hsGradYear).toEqual(new Date(doc.hsGradDate).getFullYear());
            return true;
        };

        Promise.all(validStudents.map(saveStudent))
            .then(students =>
                Promise.all(students.map(verifyStudent))
                    .then(results => {
                        if (results.every(res => res)) {
                            done();
                        } else {
                            done(new Error('Unknown Error'));
                        }
                    })
                    .catch(done)
            )
            .catch(done);
    });
});
