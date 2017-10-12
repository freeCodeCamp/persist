import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Content from '../helpers/content';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.getSearchResults(nextProps);
    }

    componentDidMount() {
        this.getSearchResults(this.props);
    }

    getSearchResults(props) {
        const { location: { query }, students, colleges } = props;
        let results = [];
        if (query.model === 'student') {
            results = _(students)
                .filter(student => student.fullName === query.fullName)
                .map(student => ({
                    link: `/student/${student.osis}`,
                    fullName: student.fullName,
                    model: 'Student'
                }))
                .value();
        } else if (query.model === 'college') {
            results = _(colleges)
                .filter(college => college.fullName === query.fullName)
                .map(college => ({
                    link: `/college/${college._id}`,
                    model: 'College',
                    fullName: college.fullName
                }))
                .value();
        }
        this.setState({
            results
        });
    }

    renderResults() {
        const { results } = this.state;
        return results.map((result, i) => (
            <tr key={_.uniqueId(result.fullName)}>
                <th>{i + 1}</th>
                <th>
                    <Link to={result.link}>{result.fullName}</Link>
                </th>
                <th>{result.model}</th>
            </tr>
        ));
    }

    render() {
        const { results } = this.state;
        if (results.length < 1) {
            return <h1>'Sorry! no results found'</h1>;
        }
        return (
            <Content title="Search Results">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderResults()}</tbody>
                </Table>
            </Content>
        );
    }
}

const mapStateToProps = state => {
    return {
        students: state.students.value,
        colleges: state.colleges.value
    };
};

export default connect(mapStateToProps)(SearchResult);
