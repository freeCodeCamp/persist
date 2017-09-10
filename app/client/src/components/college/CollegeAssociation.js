import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import async from 'async';
import StudentList from './StudentList';
import Network from './Network';
import ExportFields from '../studentFilter/exportFields'

const associatedStudent = (student, status) => ({
    osis: student.osis,
    firstName: student.firstName,
    lastName: student.lastName,
    hs: student.hs,
    hsGradYear: student.hsGradYear,
    status
});

class CollegeAssociation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: {
                associated: [],
                network: {}
            }
        };
    }

    componentDidMount() {
        this.updateGraph(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                loading: true
            },
            this.updateGraph.bind(this, nextProps)
        );
    }

    updateGraph(props) {
        this.normalizeData(props).then(data => {
            this.setState({
                data,
                loading: false
            });
        });
    }

    normalizeData(props) {
        const { students, college } = props;
        const collegeId = college._id;
        return new Promise(resolve => {
            const network = {};
            const associated = [];
            if (students.length < 1) resolve({ network, associated });
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                const hsGradDate = student.hsGradDate;
                if (hsGradDate && hsGradYear) {
                    network[hsGradYear] = network[hsGradYear] || [];
                    student.terms = _.compact(student.terms);
                    const termLength = student.terms.length;
                    let enrolled = false;
                    if (termLength > 0) {
                        let breakOut = false;
                        for (const term of student.terms) {
                            if (term.college === collegeId) {
                                switch (term.status) {
                                    case 'Graduated': {
                                        enrolled = true;
                                        associated.push(associatedStudent(student, 'Graduated'));
                                        breakOut = true;
                                        break;
                                    }
                                    case 'F': {
                                        enrolled = true;
                                        if (Math.abs(moment(new Date()).diff(moment(term.enrolBegin), 'months')) < 6) {
                                            associated.push(associatedStudent(student, 'Currently Enrolled Full-time'));
                                        } else if(Math.abs(moment(new Date()).diff(moment(term.enrolBegin), 'months')) < 12) {
                                            associated.push(associatedStudent(student, 'No current data'));
                                        } else {
                                            associated.push(associatedStudent(student, 'No longer Enrolled'));
                                        }
                                        if (Math.abs(moment(term.enrolBegin).diff(moment(hsGradDate), 'months')) < 6) {
                                            network[hsGradYear].push(student.osis);
                                        }
                                        breakOut = true;
                                        break;
                                    }
                                    case 'H':
                                    case 'L':
                                    case 'Q': {
                                        enrolled = true;
                                        if (Math.abs(moment(new Date()).diff(moment(term.enrolBegin), 'months')) < 6) {
                                            associated.push(associatedStudent(student, 'Currently Enrolled Part-time'));
                                        } else if (Math.abs(moment(new Date()).diff(moment(term.enrolBegin), 'months')) < 12) {
                                            associated.push(associatedStudent(student, 'No current data'));
                                        } else {
                                            associated.push(associatedStudent(student, 'No longer Enrolled'));
                                        }
                                        if (Math.abs(moment(term.enrolBegin).diff(moment(hsGradDate), 'months')) < 6) {
                                            network[hsGradYear].push(student.osis);
                                        }
                                        breakOut = true;
                                        break;
                                    }
                                    case 'W': {
                                        enrolled = true;
                                        associated.push(associatedStudent(student, 'No longer Enrolled'));
                                        breakOut = true;
                                        break;
                                    }
                                }
                            }
                            if (breakOut) break;
                        }
                    }
                    if (!enrolled && student.intendedCollege === collegeId) {
                        associated.push(associatedStudent(student, 'Intended to Enroll'));
                    }
                }
                setTimeout(() => {
                    callback();
                }, 0);
            }, 20);
            q.push(students);
            q.drain = () => {
                resolve({ network, associated });
            };
        });
    }

    renderLoading() {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <i className="fa fa-cog fa-spin fa-3x fa-fw" />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    render() {
        const { data: { associated, network } } = this.state;
        const { osisObj } = this.props;
        const hidden = this.state.loading ? { visibility: 'hidden' } : {};
        return (
            <div style={{ position: 'relative' }}>
                {this.state.loading ? this.renderLoading() : null}
                <div style={hidden}>
                    <Network students={network} />
                    <div>
                        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Student List</h2>
                        <ExportFields students={associated.map(student => osisObj[student.osis])} />
                        <StudentList students={associated} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    students: state.students.value,
    osisObj: state.students.osisObj
});

export default connect(mapStateToProps)(CollegeAssociation);
