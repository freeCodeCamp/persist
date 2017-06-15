const expect = require('expect');
const request = require('supertest');
const {filter, isEmpty, map, forEach} = require('lodash');
/**
 * testSeed - utility function for checking that MongoDB database has been seeded
 *              correctly for testing purposes.
 *
 * @param  {object} collection    collection of documents queried from MongoDB
 * @param  {number} expectedCount the number of documents expected to exist in the collection
 * @param  {array} validators     array of validator functions.  Each function takes a
 *                                MongoDB document, tests that document, and returns a boolean value
 *                                indicating whether the document passes some test.
 * @param  {function} done            async done function to let mocha know when test is finished.
 */
function testSeed(collection, expectedCount, validators, done) {
  try {
    expect(collection.length).toBe(expectedCount);
  } catch (err) {
    return done(err);
  }
  Promise.all(collection.map(doc => validators.every(valid => valid(doc))))
  .then(results => {
    try {
      expect(results.every(result => result === true)).toBe(true);
      done();
    } catch (err) {
      done(err);
    }
  });
}

/**
 * testModel - utility function that tests a MongoDB model.  All validInstances
 *             should save without errors, and all invalidInstances should throw
 *             errors.  If so, testModel ends by calling done(), otherwise it calls
 *             done(err).
 *
 *             For each invocation of this function it is best practice to limit
 *             the combined elements of validInstances and invalidInstances to those
 *             necessary to test a SINGLE aspect of the MongoDB model.
 *
 * @param  {function} Model            MongoDB model constructor being tested
 * @param  {array} validInstances   Array of objects each representing a valid instance
 *                                 of the model being tested.
 * @param  {array} invalidInstances Array of objects each representing an INVALID instance
 *                                 of the model being tested
 * @param  {Function} done             async done function to notify mocha when test is complete.
 */
function testModel(Model, validInstances, invalidInstances, done) {
  const saveValidDoc = (doc) => new Model(doc).save().then(res => res).catch(done);
  const saveInvalidDoc = (doc) => new Model(doc).save().then(res => res).catch(err => err);

  Promise.all(validInstances.map(saveValidDoc))
    .then(() => Promise.all(invalidInstances.map(saveInvalidDoc))
                  .then(results => {
                    const passed = filter(results, res => !(res instanceof Error));
                    if (isEmpty(passed)) {
                      return done();
                    } else {
                      return done(new Error(`Model should not save ${passed}`))
                    }
                  }).catch(done))
    .catch(done);
}



/**
 * Object.resolve - Helper function to find nested properties with a single key
 *                  of the form 'key1.key2.key3'
 *
 * @param  {string} path string of nested keys seperated by .
 * @param  {object} obj  object to be searched for nested property
 * @return {variable}      value of obj[path]
 */
Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self);
}


/**
 * testRoute - utility function to test a NodeJS Express REST route.  A series of tests
 *             are run against the Express app.  Each test should have the form:
 *
 *              test: {
 *                request: {
 *                  method: string,     // 'get', 'put', 'delete', etc.
 *                  url: string,        // api route
 *                  body: object        // body to be sent as json for 'post' or 'put' requests
 *                },
 *                response: {
 *                  'key': 'expected value',
 *                  'nested.key.as.string': 'expected value'
 *                },
 *              }
 *
 * @param  {object} app   NodeJS Express Server instance
 * @param  {array} tests Array of expected request/response pairs.
 * @param  {function} done  async done function to notify mocha when test is complete.
 */
function testRoute(app, tests, done) {
  const runTest = (test) => {
    const checkResult = (res) => {
      return map(test.response, (value, key) => {
        expect(Object.resolve(key, res)).toBe(value);
      });
    };

    return request(app)
      [test.request.method.toLowerCase().trim()](test.request.url)
      .send(test.request.body)
      .then(checkResult);
  }

  Promise.all(map(tests, runTest))
  .then(() => done())
  .catch(done);
}

module.exports = {
  testSeed,
  testModel,
  testRoute,
}
