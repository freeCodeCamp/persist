import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import {exportArray, exportStudents} from '../../../app/client/src/actions/export';
import { applicationKeys, collegeGraduationKeys, collegeKeys, termKeys, caseNotesKeys } from '../../../app/common/fieldKeys';

describe('Export Actions', () => {

  describe('exportArray', () => {

    it('should dispatch SPINNER_PAGE with payload: true', () => {
      const dispatch = sinon.spy();

      const students = ['a', 'b', 'c'];
      const type = 'application';

      exportArray(students, type)(dispatch);
      sinon.assert.calledWith(dispatch, {type: types.SPINNER_PAGE, payload: true});
    });

    it.skip('should call json2csv CANNOT STUB JSON2CSV THE WAY EXPORTARRAY IS CURRENTLY IMPLEMENTED', () => {
      // TODO exportArray has an instance of json2csv hidden in a closure that cannot be stubbed
      // from here changing the function to use an instance of json2csv from the global context
      // would allow for better testing but MAY cause other issues.
      const dispatch = sinon.spy();
      const jsonCsvStub = sinon.stub(global, 'json2csv');

      const students = ['a', 'b', 'c'];
      const type = 'application';

      exportArray(students, type)(dispatch);
      sinon.assert.calledOnce(jsonCsvStub);
      jsonCsvStub.restore();
    });

    it('should switch between applications, terms, and caseNotes types', () => {
      const dispatch = sinon.spy();
      const mapStub = sinon.stub(global._, 'map');

      const students = ['a', 'b', 'c'];
      const types = ['applications', 'terms', 'caseNotes'];

      types.forEach((type) => {
        exportArray(students, type)(dispatch);
        switch (type) {
          case 'applications':
            sinon.assert.calledWith(mapStub, applicationKeys, 'fieldName');
            sinon.assert.calledWith(mapStub, applicationKeys, 'dbName');
            break;
          case 'terms':
            sinon.assert.calledWith(mapStub, termKeys, 'fieldName');
            sinon.assert.calledWith(mapStub, termKeys, 'dbName');
            break;
          case 'caseNotes':
            sinon.assert.calledWith(mapStub, caseNotesKeys, 'fieldName');
            sinon.assert.calledWith(mapStub, caseNotesKeys, 'dbName');
        }
      });
      mapStub.restore();
    });
  });

  describe('exportStudents', () => {
    it('should dispatch SPINNER_PAGE with payload: true', () => {
      const dispatch = sinon.spy();

      const fields = ['a', 'b', 'c'];
      const students = [1, 2, 3];

      exportStudents(fields, students)(dispatch);
      sinon.assert.calledWith(dispatch, {type: types.SPINNER_PAGE, payload: true});
    });

    it.skip('should call json2csv CANNOT STUB JSON2CSV THE WAY EXPORTSTUDENTS IS CURRENTLY IMPLEMENTED', () => {
      // TODO exportStudents has an instance of json2csv hidden in a closure that cannot be stubbed
      // from here changing the function to use an instance of json2csv from the global context
      // would allow for better testing but MAY cause other issues.
      const dispatch = sinon.spy();
      const jsonCsvStub = sinon.stub(global, 'json2csv');

      const fields = ['a', 'b', 'c'];
      const students = [1, 2, 3];

      exportStudents(fields, students)(dispatch);
      sinon.assert.calledOnce(jsonCsvStub);
      jsonCsvStub.restore();
    });
  });
});
