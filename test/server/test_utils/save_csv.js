import expect from 'expect';
import path from 'path';
import sinon from 'sinon';

import saveCsv, { parser, transformer } from '../../../app/server/utils/save_csv';
import { Student } from '../../../app/server/models';

const { students } = require('../dbseed/seed');
const TEST_FILE = path.join(process.env.PWD, 'test/server/data/studentData.csv');
const MAL_FILE = path.join(process.env.PWD, 'test/server/data/studentData_malformed.csv');

describe('util: save_csv', () => {
  it('should update DB with records from the file', (done) => {
    saveCsv(TEST_FILE)
      .then((res) => {
        Student.find({})
          .then((students) => {
            expect(students.length)
              .toBe(23);
            done();
          })
          .catch(done);
      });
  });

  it('should handle malformed data without errors', (done) => {
    saveCsv(MAL_FILE)
      .then((res) => {
        Student.find({})
          .then((students) => {
            expect(students.length)
              .toBe(3);
            done();
          })
          .catch(done);
      });
  });
});