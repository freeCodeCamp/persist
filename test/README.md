# Test Suite

This suite of automated tests aims to provide high test coverage of the application code.  The test suite relies on the following tools:

* [Mocha Test Framework](https://github.com/mochajs/mocha)
* [Karma Test Runner](https://github.com/karma-runner/karma) for front-end tests
* [PhantomJS](https://github.com/ariya/phantomjs) for front-end tests
* [Expect Assertion Library](https://github.com/mjackson/expect)
* [Sinon Mocking Library](http://sinonjs.org/releases/v2.3.2/)
* [Supertest](https://github.com/visionmedia/supertest)
* [Istanbul Test Coverage Reporter](https://github.com/gotwarlost/istanbul)

as well as a handful of other libraries as needed in individual tests.

The full test suite can be run via `$ npm test`.

**Important**: Make sure `TEST_MONGODB_URI` is set and *not* equal to `MONGODB_URI`.

## Front-End Tests

Run front end tests with
```
$ npm run test-client
```
Coverage reports can be viewed in detail by loading `test/client/coverage/html` in any web browser.

### Organization

Front-end tests are organized by type in folders matching `test/client/test_*`:

* `test/client/app_test.js` contains polyfills for PhantomJS and checks that tests run properly.  This should always run first (which is why other tests need to be placed in `test_*` subfolders).
* `test/client/test_actions` holds tests for `app/client/src/actions`.  Each test file corresponds to a directory of actions.
* `test/client/test_components` holds tests for `app/client/src/components`.  Each test file corresponds to a directory of components.
* `test/client/test_reducers` holds tests for `app/client/src/reducers`.

## Back-End Tests

Back-end tests require a `TEST_MONGODB_URI` environment variable in order to run.  This value should **never** be equal to the `MONGODB_URI` environment variable as the tests will clobber and re-seed the database located at `TEST_MONGO_DB_URI`.

Run back-end tests with
```
$ npm run test-server
```
Coverage reports can be viewed in detail by loading `test/server/coverage/lcov-report` in any web browser.

### Organization

Back-end tests are organized by type in folders matching `test/server/test_*`:

* `test/server/app_test.js` sets up tests and checks that DB seeding is working correctly.
* `test/server/test_routes` holds tests for Express routes.  Each file should focus on a single route path and contain all of its implemented HTTP verbs (GET, POST, etc.).
* `test/server/test_models` holds test for MongoDB model. Each file should test a single model, and test all queries used by the app, as well as any validation that needs to be tested.
