import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import { addReminder, removeReminder } from '../../../app/client/src/actions/reminders';

describe.skip('Reminders Actions', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    describe('addReminder', () => {});

    describe('removeReminder', () => {});
});
