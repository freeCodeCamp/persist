const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const { ObjectID } = require('mongodb');
const { map, every } = require('lodash');
const { testModel } = require('../testUtils');

const validator = require('../../../app/common/validator');
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require('../../../app/common/constants');
const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('user', () => {
    it('should require a unique email address', done => {
        const validUsers = [
            {
                email: 'test@test.com', // Unused value
                password: 'pword',
                profile: { firstName: 'Anonymous' }
            }
        ];
        const invalidUsers = [
            {
                email: 'test@test.com', // Duplicate value
                password: 'testing',
                profile: { firstName: 'Anonymous' }
            }
        ];

        testModel(dbModels.User, validUsers, invalidUsers, done);
    });

    it('should reject invalid email addresses', done => {
        const validUsers = [
            {
                email: 'test@test.com', // Valid Email
                password: 'pword',
                profile: { firstName: 'Anonymous' }
            }
        ];
        const invalidUsers = [
            {
                email: 'testtest.com', // Invalid Email
                password: 'testing',
                profile: { firstName: 'Anonymous' }
            },
            {
                email: 'test@test', // Invalid Email
                password: 'testing',
                profile: { firstName: 'Anonymous' }
            },
            {
                email: 'test', // Invalid Email
                password: 'testing',
                profile: { firstName: 'Anonymous' }
            }
        ];

        testModel(dbModels.User, validUsers, invalidUsers, done);
    });

    it('should require a password', done => {
        const validUsers = [
            {
                email: 'test@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' }
            }
        ];
        const invalidUsers = [
            {
                email: 'second@test.com', // Missing password
                profile: { firstName: 'Anonymous' }
            }
        ];

        testModel(dbModels.User, validUsers, invalidUsers, done);
    });

    it('should not include password in query responses', done => {
        dbModels.User
            .find({})
            .then(users => {
                const noPasswords = every(users, ({ password }) => password === undefined);
                expect(noPasswords).toBe(true);
                done();
            })
            .catch(done);
    });

    it('should require a profile.firstName value', done => {
        const validUsers = [
            {
                email: 'test@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' }
            }
        ];
        const invalidUsers = [
            {
                email: 'second@test.com', // Missing Profile
                password: 'pword'
            }
        ];

        testModel(dbModels.User, validUsers, invalidUsers, done);
    });

    it('should validate the access value', done => {
        const validUsers = [
            {
                email: 'test@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' },
                access: {
                    role: ROLE_ADMIN
                }
            },
            {
                email: 'test2@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' },
                access: {
                    role: ROLE_COUNSELOR,
                    school: new ObjectID()
                }
            },
            {
                email: 'test3@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' },
                access: {
                    role: ROLE_OWNER
                }
            }
        ];
        const invalidUsers = [
            {
                email: 'second@test.com',
                password: 'pword',
                profile: { firstName: 'Anonymous' },
                access: {
                    role: ROLE_COUNSELOR
                }
            }
        ];

        testModel(dbModels.User, validUsers, invalidUsers, done);
    });
});
