import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import {saveDocument, saveCaseNote, saveApplication, saveTerm, saveAlias} from '../../../app/client/src/actions/students';
import {deleteDocument, deleteCaseNote, deleteApplication, deleteTerm, deleteAlias} from '../../../app/client/src/actions/students';

describe.skip('Socket Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('saveDocument', () => {});

  describe('deleteDocument', () => {});

  describe('saveCaseNote', () => {});

  describe('deleteCaseNote', () => {});

  describe('saveApplication', () => {});

  describe('deleteApplication', () => {});

  describe('saveTerm', () => {});

  describe('deleteTerm', () => {});

  describe('saveAlias', () => {});

  describe('deleteAlias', () => {});

});
