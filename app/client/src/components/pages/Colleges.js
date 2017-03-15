import React, {Component} from 'react';
import Content from '../helpers/content';
import CollegeFilter from '../college/CollegeFilter';
import CollegeTable from '../college/CollegeTable';

class Colleges extends Component {

    constructor() {
        super();
        this.state = {
            colleges: []
        }
    }

    setColleges(colleges) {
        this.setState({
            colleges
        });
    }

    render() {
        return (
            <Content title='Colleges'>
                <CollegeFilter setColleges={(colleges) => this.setColleges(colleges)} />
                <CollegeTable colleges={ this.state.colleges } />
            </Content>
        );
    }
}

export default Colleges;
