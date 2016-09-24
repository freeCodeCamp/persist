import React from 'react';
import  { connect } from 'react-redux';
import { Link } from 'react-router';
import { Table } from 'reactstrap';

class CollegeTable extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {

        const collegesHTML = this.props.colleges.map((college, i) => {
            return (
                <tr key={i}>
                    <th>{i}</th>
                    <th>
                        <Link to={`/college/${college.fullName}`}>
                        {college.shortName}
                        </Link>
                    </th>
                    <th>{college.fullName}</th>
                </tr>
            );
        });

        
        return (
            <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Short Name</th>
                    <th>Full Name</th>
                  </tr>
                </thead>
                <tbody>
                  {collegesHTML}
                </tbody>
            </Table>

            );
    }
}


export default CollegeTable;




