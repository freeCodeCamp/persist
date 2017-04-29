import React from 'react';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import uniqueId from 'lodash/uniqueId';

class CollegeTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { colleges } = this.props;
        const collegesHTML = colleges.map((college, i) => {
            return (
                <tr key={uniqueId(college._id)}>
                    <td>
                        {i + 1}
                    </td>
                    <td>
                        <Link to={`/college/${college._id}`}>
                            {college.fullName}
                        </Link>
                    </td>
                    <td>
                        {college.navianceName}
                    </td>
                </tr>
            );
        });

        if (colleges.length < 1) return null;

        return (
            <Table striped bordered hover className="college-table">
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            Full Name
                        </th>
                        <th>
                            Naviance Name
                        </th>
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
