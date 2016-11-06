import React, {Component} from 'react';
import {EthnicityChart, HSGradYear} from './';

class ChartTabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'ethnicity'
    }
  }

  componentDidMount() {
    $(this.tabs).find('a[data-toggle="tab"]').on('click', (e) => {
      this.setState({
        activeTab: $(e.target).attr('href').substring(1)
      });
    });
  }

  componentWillUnmount() {
    $(this.tabs).find('a[data-toggle="tab"]').off();
  }

  render() {
    return (
      <div className="nav-tabs-custom">
        {/* Tabs within a box */}
        <ul className="nav nav-tabs pull-right ui-sortable-handle" ref={(c) => this.tabs = c}>
          <li className=""><a href="#hsGradYear" data-toggle="tab" aria-expanded="false">HS Grad Year</a></li>
          <li className="active"><a href="#ethnicity" data-toggle="tab" aria-expanded="true">Ethnicity</a></li>
          <li className="pull-left header"><i className="fa fa-inbox"></i>Filters</li>
        </ul>
        <div className="tab-content no-padding">
          {/* Charts */}
          <EthnicityChart id='ethnicity' active={this.state.activeTab === 'ethnicity'} students={this.props.students}/>
          <HSGradYear id='hsGradYear' active={this.state.activeTab === 'hsGradYear'} students={this.props.students}/>
        </div>
      </div>
    );
  }
}

export default ChartTabs;