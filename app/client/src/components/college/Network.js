import React, { Component } from 'react';
import keys from 'lodash/keys';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Table } from 'react-bootstrap';

class Network extends Component {
    loadFiltered(students) {
        const { push } = this.props;
        localStorage.setItem('filtered', JSON.stringify(students));
        push('/filtered');
    }

    render() {
        const { students } = this.props;
        const years = keys(students).sort();
        const yearsHTML = years.map((year, i) => {
            return (
                <tr key={i}>
                    <td>
                        {i + 1}
                    </td>
                    <td>{year}</td>
                    <td onClick={() => this.loadFiltered(students[year])}>{students[year].length}</td>
                </tr>
            );
        });

        return (
            <div>
                <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Number of Network Students Attending Each Year</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Year</th>
                            <th>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearsHTML}
                    </tbody>
                </Table>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            push
        },
        dispatch
    );
};

export default connect(null, mapDispatchToProps)(Network);
