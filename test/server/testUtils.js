const expect = require('expect');
const {filter, isEmpty} = require('lodash');
/**
 * testSeed - utility function for checking that MongoDB database has been seeded
 *              correctly for testing purposes.
 *
 * @param  {object} collection    collection of documents queried from MongoDB
 * @param  {number} expectedCount the number of documents expected to exist in the collection
 * @param  {array} validators     array of validator functions.  Each function takes a
 *                                MongoDB document, tests that document, and returns a boolean value
 *                                indicating whether the document passes some test.
 * @param  {type} done            async done function to let mocha know when test is finished.
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
 * @param  {type} Model            MongoDB model constructor being tested
 * @param  {type} validInstances   Array of objects each representing a valid instance
 *                                 of the model being tested.
 * @param  {type} invalidInstances Array of objects each representing an INVALID instance
 *                                 of the model being tested
 * @param  {type} done             async done function to notify mocha when test is complete.
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

module.exports = {
  testSeed,
  testModel,
}
