import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Content from '../helpers/content';

import * as getCollege from '../../actions/getCollege';

import SingleCollegeForm from '../college/SingleCollegeForm';

class SingleCollege extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getCollege(this.props.params.fullName);
  }

  render() {
    console.log(this.props);
    const {singleCollege} = this.props;
    const college = singleCollege.college;
    return (
      <Content>
        { singleCollege.pending ? <div>
                                    <p>
                                      Loading
                                    </p><i style={ { fontSize: '50px', textAlign: 'center' } } className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                                  </div> : null }
        { singleCollege.error ? <p>
                                  Error Found
                                </p> : null }
        { singleCollege.success ? <div>
                                    <h1 style={ { margin: '20px' } }>{ `${college.fullName}` }</h1>
                                    <SingleCollegeForm initialValues={ college } college={ college } />
                                  </div> : null }
      </Content>
      );
  }
}

function mapStateToProps(state) {
  return {
    singleCollege: state.singleCollege
  };
}

export default connect(mapStateToProps, getCollege)(SingleCollege);

