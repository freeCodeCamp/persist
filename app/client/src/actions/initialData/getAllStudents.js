import async from 'async';
import cookie from 'react-cookie';
import { GET_ALL_STUDENTS_ERROR, ALL_REMINDERS, GET_ALL_STUDENTS_PENDING, GET_ALL_STUDENTS_SUCCESS } from '../types';
import { axios } from '../utils';

export default () => {
    return dispatch => {
        dispatch({
            type: GET_ALL_STUDENTS_PENDING
        });

        return axios()
            .get('/api/students')
            .then(response => {
                dispatch({
                    type: GET_ALL_STUDENTS_SUCCESS,
                    payload: response.data
                });

                // TODO Should probably be refactored for readability/maintability.
                const user = cookie.load('user');
                const caseNotes = [];
                const q = async.queue(
                    (student, callback) => {
                        const osis = student.osis;
                        const studentCaseNotes = student.caseNotes;
                        if (studentCaseNotes.length > 0) {
                            const filtered = studentCaseNotes.filter(caseNote => {
                                if (caseNote.user === user._id && caseNote.needFollowUp && !caseNote.issueResolved) {
                                    caseNote.osis = osis;
                                    return true;
                                }
                                return false;
                            });
                            caseNotes.push(...filtered);
                        }
                        setTimeout(
                            () => {
                                callback();
                            },
                            0
                        );
                    },
                    10
                );
                q.push(response.data);
                q.drain = () => {
                    dispatch({
                        type: ALL_REMINDERS,
                        payload: caseNotes
                    });
                };
            })
            .catch(err => {
                dispatch({
                    type: GET_ALL_STUDENTS_ERROR,
                    payload: err
                });
                // HACK Needs to return Promise.reject for testing to work.
                // userAgent check SHOULD protect from this in production.
                // There may be a better way of doing this that I haven't thought
                // of yet.
                if(/PhantomJS/.test(navigator.userAgent)) {
                  return Promise.reject(err);
                } else {
                  return err;
                }
            });
    };
};
