import React from 'react';
import {connect} from 'react-redux';
import Content from '../helpers/content';
import isEmpty from 'lodash/isEmpty';
import {createSelector} from 'reselect';
import SingleCollegeForm from '../college/SingleCollegeForm';

class SingleCollege extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const {college} = this.props;
        const collegeData = college.data;
        return (
            <Content title={collegeData.fullName}>
                {college.success && collegeData ?
                    <div>
                        <SingleCollegeForm initialValues={ collegeData } college={ collegeData }/>
                    </div> : college.success && !collegeData ?
                    <div>No Records Found</div> :
                    <div>
                        <p>
                            Loading
                        </p><i style={ {fontSize: '50px', textAlign: 'center'} }
                               className="fa fa-spinner fa-spin fa-3x fa-fw"/>
                    </div>
                }
            </Content>
        );
    }
}

const getColleges = (state) => state.colleges.idObj;
const getId = (_, props) => props.params.id;

const makeGetCollege = () => {
    return createSelector(
        [getColleges, getId],
        (colleges, id) => {
            if (isEmpty(colleges)) {
                return {success: false, data: null}
            }
            console.log(id);
            return {success: true, data: colleges[id]};
        }
    )
};

const makeMapStateToProps = () => {
    const getCollege = makeGetCollege();
    const mapStateToProps = (state, props) => {
        return {
            college: getCollege(state, props)
        }
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps)(SingleCollege);

