import React from 'react';
import { Link } from 'react-router';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Table } from 'react-bootstrap';

class StudentList extends React.Component {
    constructor(props) {
        super(props);
        this.updating = false;
        this.length = 0;
        this.mounted = false;
        this.sortType = 'asc';
        this.state = {
            students: [],
            offset: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.students, nextProps.students)) {
            this.setState({
                students: [],
                offset: 0
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(this.props.students, prevProps.students)) {
            this.length = this.props.students.length;
            this.getNewStudents();
        }
    }

    componentDidMount() {
        this.mounted = true;
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.length = this.props.students.length;
        this.getNewStudents();
    }

    handleScroll() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
            this.getNewStudents();
        }
    }

    getNewStudents() {
        if (!this.mounted) return;
        const _this = this;
        const { students } = this.props;
        const { offset } = this.state;
        if (this.updating || offset > this.length) return;
        this.updating = true;
        this.setState(
            {
                offset: offset + 20,
                students: students.slice(0, offset + 20)
            },
            () => {
                _this.updating = false;
            }
        );
    }

    switchSort() {
        if (this.sortType === 'asc') {
            this.sortType = 'desc';
        } else {
            this.sortType = 'asc';
        }
    }

    sortTable(columnName) {
        const { schoolObj } = this.props;
        const { students } = this.state;
        const sortedStudents = sortBy(students, student => {
            if (columnName === 'hs') {
                return schoolObj[student.hs].name;
            }
            return student[columnName];
        });
        if (this.sortType === 'desc') {
            sortedStudents.reverse();
        }
        this.switchSort();
        this.setState({
            students: sortedStudents
        });
    }

    renderLoading() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: 40
                }}
            >
                <i className="fa fa-cog fa-spin fa-3x fa-fw" />
            </div>
        );
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    render() {
        const { students } = this.state;
        const { noSearch, schoolObj } = this.props;
        if (students.length < 1) {
            if (!noSearch) {
                return <h1>'Sorry! no results found'</h1>;
            }
            return this.renderLoading();
        }
        const studentsHTML = students.map((student, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                        <Link to={`/student/${student.osis}`}>{student.firstName}</Link>
                    </td>
                    <td>{student.lastName}</td>
                    <td>{student.hsGradYear}</td>
                    <td>{schoolObj[student.hs] ? schoolObj[student.hs].name : ''}</td>
                    <td>{student.status}</td>
                </tr>
            );
        });

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th onClick={() => this.sortTable('firstName')}>First Name</th>
                        <th onClick={() => this.sortTable('lastName')}>Last Name</th>
                        <th onClick={() => this.sortTable('hsGradYear')}>HS Grad Year</th>
                        <th onClick={() => this.sortTable('hs')}>HS</th>
                        <th onClick={() => this.sortTable('status')}>Status</th>
                    </tr>
                </thead>
                <tbody>{studentsHTML}</tbody>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    schoolObj: state.schools.idObj
});

export default connect(mapStateToProps)(StudentList);
