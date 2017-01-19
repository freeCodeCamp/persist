import React from 'react';
import {Link} from 'react-router';
import {Table} from 'react-bootstrap';

class StudentTable extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const {students} = this.props;
        if (students.length < 1) {
            return <h1>'Sorry! no results found'</h1>;
        }
        const studentsHTML = students.map((student, i) => {
            return (
                <tr key={ i }>
                    <td>
                        { i + 1 }
                    </td>
                    <td>
                        <Link to={ `/student/${student.osis}` }>
                            { student.firstName }
                        </Link>
                    </td>
                    <td>
                        { student.lastName }
                    </td>
                </tr>
            );
        });


        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>
                        #
                    </th>
                    <th>
                        First Name
                    </th>
                    <th>
                        Last Name
                    </th>
                </tr>
                </thead>
                <tbody>
                { studentsHTML }
                </tbody>
            </Table>

        );
    }
}

export default StudentTable;
