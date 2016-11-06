import React, {Component} from 'react';
import {Donut} from '../admin-components/charts';
import _ from 'lodash';

class EthnicityChart extends Component {
  constructor(props) {
    super(props);
    this.data = this.normalizeData();
  }

  componentWillUpdate() {
    this.data = this.normalizeData();
  }

  normalizeData() {
    if (this.props.students.length < 1) return [];
    let data = _.times(7, (n) => {
      return {
        label: n + 1,
        value: 0
      };
    });
    _.forEach(this.props.students, (student) => {
      const ethnicity = student.ethnicity;
      if (ethnicity) {
        data[ethnicity - 1].value += 1;
      }
    });
    return data;
  }

  render() {
    return (
      <Donut {...this.props} data={this.normalizeData()}/>
    );
  }

}

export default EthnicityChart;