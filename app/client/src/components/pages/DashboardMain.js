import React from 'react';
import InfoTile from '../charts/InfoTile';
import Content from '../helpers/content';
import ChartFilter from '../charts/Filter';
import { connect } from 'react-redux';

import Donut from '../admin-components/charts/Donut';

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);
  }

  data() {
    const data = [];

    for (var i = 1; i < 8; i++) {
      data.push({
        label: i,
        value: 0
      });
    }
    this.props.students.map(function(elem) {
      if (elem.ethnicity) {
        data[elem.ethnicity-1].value++;
      }
    });
    console.log(data);
    return data;
  }

  render() {
    const donutProps = {
      id: 'donut-chart-1',
      title: 'College Direct Enrollment',
      colors: ['yellow', 'black', 'orange', 'red', 'blue', 'green'],
      data: this.data(),
      title: 'Ethnicity'
    };

    return (
      <Content title='Welcome'>
        <ChartFilter />
        <div className='row' style={ { marginTop: '30px' } }>
          <InfoTile icon='fa-envelope-o'
            subject='Users'
            stats='1000'
            theme='bg-aqua'
            width={ 4 } />
          <InfoTile icon='fa-flag-o'
            subject='Students'
            stats='1000'
            theme='bg-red'
            width={ 4 } />
          <InfoTile icon='fa-star-o'
            subject='Schools'
            stats='1000'
            theme='bg-yellow'
            width={ 4 } />
        </div>
        <Donut {...donutProps} />
      </Content>
      );
  }
}


const mapStateToProps = (state) => {
  return {
    students: state.chartFilter.students
  };
};

DashboardMain = connect(mapStateToProps)(DashboardMain);

export default DashboardMain;
