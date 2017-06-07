const expect = require('expect');

/**
 * verifySeed - utility function for checking that MongoDB database has been seeded
 *              correctly for testing purposes.
 *
 * @param  {object} collection    collection of documents queried from MongoDB
 * @param  {number} expectedCount the number of documents expected to exist in the collection
 * @param  {array} validators     array of validator functions.  Each function takes a
 *                                MongoDB document, tests that document, and returns a boolean value
 * @param  {type} done            async done function to let mocha know when test is finished.
 */
function verifySeed(collection, expectedCount, validators, done) {
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
 *             done(err)
 *
 * @param  {type} Model            MongoDB model constructor being tested
 * @param  {type} validInstances   Array of objects each representing a valid instance
 *                                 of the model being tested.
 * @param  {type} invalidInstances Array of objects each representing an INVALID instance
 *                                 of the model being tested
 * @param  {type} done             async done function to notify mocha when test is complete.
 */
function testModel(Model, validInstances, invalidInstances, done) {
  const saveDoc = doc => new Model(doc).save();

  Promise.all(validInstances.map(saveDoc))
    .then(() => Promise.all(invalidInstances.map(saveDoc))
                  .then(success => done(new Error(`${Model.name} model should not save ${success}`)))
                  .catch(err => done()))
    .catch(done);
}

module.exports = {
  verifySeed,
  testModel,
}
