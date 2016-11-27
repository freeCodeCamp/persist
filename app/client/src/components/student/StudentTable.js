import React from 'react';
import {Link} from 'react-router';
import {Table} from 'react-bootstrap';


class StudentTable extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {students} = this.props;
        if (students.length < 1) return null;
        const studentsHTML = students.map((student, i) => {
            return (
                <tr key={ i }>
                    <th>
                        { i + 1 }
                    </th>
                    <th>
                        <Link to={ `/student/${student.osis}` }>
                            { student.firstName }
                        </Link>
                    </th>
                    <th>
                        { student.lastName }
                    </th>
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




