import React, {Component} from 'react';
import {StackedColumn} from '../admin-components/charts';
import _ from 'lodash';

class HSGradYear extends Component {
  constructor(props) {
    super(props);
    this.data = this.normalizeData();
  }

  componentWillUpdate() {
    this.data = this.normalizeData();
  }

  normalizeData() {
    if (this.props.students.length < 1) return [];
    const defaultEthnicityData = {};
    _.times(7, (n) => {
      defaultEthnicityData[n + 1] = 0;
    });
    const data = _.reduce(this.props.students, (result, student) => {
      const hsGradYear = student.hsGradYear;
      if (hsGradYear) {
        result[hsGradYear] = result[hsGradYear] || _.clone(defaultEthnicityData);
        const ethnicity = student.ethnicity;
        if (ethnicity) {
          result[hsGradYear][ethnicity] += 1;
        }
      }
      return result;
    }, {});
    const sortedData = {};
    _(data).keys().sort().forEach((key) => {
      sortedData[key] = data[key];
    });
    return sortedData;
  }

  render() {
    return (
      <StackedColumn {...this.props} data={this.normalizeData()}/>
    );
  }

}

export default HSGradYear;