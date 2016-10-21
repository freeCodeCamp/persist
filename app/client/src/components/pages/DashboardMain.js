import React from 'react';
import InfoTile from '../charts/InfoTile';
import Content from '../helpers/content';
import ChartFilter from '../charts/Filter';

class DashboardMain extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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

      <h1> Charts Will Go Here </h1>

      

      </Content>
      );
  }
}

export default DashboardMain;
