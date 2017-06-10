import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import util from '../../../app/client/src/actions/utils';

describe.skip('Utility Actions', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    describe('addReminder', () => {});
});
