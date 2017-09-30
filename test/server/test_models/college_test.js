const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const { ObjectID } = require('mongodb');
const validator = require('../../../app/common/validator');
const { testModel } = require('../testUtils');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('college', done => {
    it('should require a unique opeid field', done => {
        const validColleges = [{ opeid: 'opeid' }];

        const invalidColleges = [
            { opeid: 'opeid' }, // Duplicate -- Opeids must be unique
            { fullName: 'fullName' } // Lacks required opeid
        ];

        testModel(dbModels.College, validColleges, invalidColleges, done);
    });
});
