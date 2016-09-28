import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';

class CollegeTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const collegesHTML = this.props.colleges.map((college, i) => {
      return (
        <tr key={ i }>
          <td>
            { i }
          </td>
          <td>
            <Link to={ `/college/${college.fullName}` }>
            { college.shortName }
            </Link>
          </td>
          <td>
            { college.fullName }
          </td>
        </tr>
        );
    });


    return (
      <Table striped bordered hover className='college-table'>
        <thead>
          <tr>
            <th>
              #
            </th>
            <th>
              Short Name
            </th>
            <th>
              Full Name
            </th>
          </tr>
        </thead>
        <tbody>
          { collegesHTML }
        </tbody>
      </Table>

      );
  }
}


export default CollegeTable;




