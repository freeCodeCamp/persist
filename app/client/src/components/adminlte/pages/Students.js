import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router';

class Students extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: []
        };
    }
    
    componentWillMount() {
        var _this = this;
        axios.get('/api/students').then((response) => {
            // _this.students = response.data;
            console.log(response.data);
            _this.setState({students: response.data});
        });
    }

    render() {

        const studentsHTML = this.state.students.map((student, i) => {
        	return (
             	<tr key={i}>
						<th>{i}</th>
						<th>
							<Link to={`/student/${student.contactID}`}>
							{student.firstName}
							</Link>
						</th>
						<th>{student.lastName}</th>
                </tr>
            );
        });


        return (
        	<div>
                <h1> Students </h1>
                <Table striped border hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsHTML}
                    </tbody>
                  </Table>
        	</div>
        );
    };
}

export default Students;