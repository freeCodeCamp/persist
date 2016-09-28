import React, { Component } from 'react';
import axios from 'axios';
import * as getSchool from '../../actions/getSchool';

import { connect } from 'react-redux';

import Content from '../helpers/content';

import { Panel, PanelGroup } from 'react-bootstrap';

class Schools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 1
    };
  }

  handleSelect(activeKey) {
    this.setState({
      activeKey
    });
  }

  componentDidMount() {
    this.props.getSchool();
  }

  render() {
    let schoolHTML = this.props.schools.schools.map((school, i) => {
      return (
        <Panel header={ school.name } eventKey={ i } key={ i }>
          { `${school.name} content ` }
        </Panel>
        );
    });

    return (
      <Content title='Schools'>
        <PanelGroup activeKey={ this.state.activeKey } onSelect={ this.handleSelect.bind(this) } accordion>
          { schoolHTML }
        </PanelGroup>
      </Content>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    schools: state.schools
  };
};

Schools = connect(mapStateToProps, getSchool)(Schools);

export default Schools;
