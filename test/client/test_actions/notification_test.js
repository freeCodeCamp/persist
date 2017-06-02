import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import {getNotifications, markReadNotification, markReadAllNotification} from '../../../app/client/src/actions/notification';

describe.skip('Notification Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('getNotifications', () => {});

  describe('markReadNotification', () => {});

  describe('markReadAllNotification', () => {});
});
