import React from 'react';
import { reduxForm } from 'redux-form';
import { AutoComplete } from 'material-ui';
import { connect } from 'react-redux';

class FilterCollegeForm extends React.Component {
    constructor(props) {
        super(props);
    }

    getColleges(v) {
        const { colleges, setColleges } = this.props;
        const filtered = colleges.filter(college => college.fullName === v.text);
        setColleges(filtered);
    }

    render() {
        const { collegeSource } = this.props;
        return (
            <AutoComplete
                fullWidth={true}
                floatingLabelText="Search"
                filter={AutoComplete.caseInsensitiveFilter}
                name="collegeSearch"
                onNewRequest={v => this.getColleges(v)}
                dataSource={collegeSource}
                maxSearchResults={5}
            />
        );
    }
}

FilterCollegeForm = reduxForm({
    form: 'FilterCollege' // a unique name for this form
})(FilterCollegeForm);

const mapStateToProps = state => ({
    collegeSource: state.colleges.collegeSource,
    colleges: state.colleges.value
});

export default connect(mapStateToProps)(FilterCollegeForm);
