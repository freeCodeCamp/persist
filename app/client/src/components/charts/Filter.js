import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Clearfix } from 'react-bootstrap';
import keyBy from 'lodash/keyBy';
import { reduxForm, Field } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import { studentKeys } from '../../../../common/fieldKeys';
import { ReduxFormGroup } from '../helpers';
import { SelectField, TextField, AutoComplete } from 'redux-form-material-ui';
import RangeSlider from '../helpers/RangeSlider';
const studentKeysObj = keyBy(studentKeys, 'dbName');

class ChartFilter extends React.Component {

    constructor(props) {
        super(props);
    }

    fieldsHTML(form) {
        const fields = [
            'studentSupportOrgName',
            'hsGradYear',
            'ethnicity',
            'hs',
            'intendedCollege',
            'gender',
            'cohort'
        ];
        const nullValueFields = ['hs', 'intendedCollege'];
        const HTML = [];
        fields.map((field, i) => {
            const fieldObj = studentKeysObj[field];
            let nullValue = false;
            if (nullValueFields.includes(fieldObj.dbName)) {
                nullValue = true;
            }
            HTML.push(
                <Col key={ fieldObj.dbName }
                     style={{ display: 'flex', justifyContent: 'center' }} xs={12}
                     sm={6} md={6}
                     lg={4}>
                    <ReduxFormGroup
                        nullAllowed={nullValue}
                        form={form}
                        field={ fieldObj }
                    />
                </Col>
            );
            if ((i + 1) % 2 === 0) {
                HTML.push(<Clearfix key={`${field.dbName}-sm-md-${i}`} visibleSmBlock visibleMdBlock />);
            }
            if ((i + 1) % 3 === 0) {
                HTML.push(<Clearfix key={`${field.dbName}-lg-${i}`} visibleLgBlock />);
            }
        });
        return HTML;
    }

    render() {
        const { handleSubmit, handleFormSubmit } = this.props;
        return (
            <form onSubmit={ handleSubmit(handleFormSubmit) }>
                <Row>
                    {this.fieldsHTML(this)}
                    <Col key='hsGPA'
                         style={{ display: 'flex', justifyContent: 'center' }} xs={12}
                         sm={6} md={6}
                         lg={4}>
                        <Field name='hsGPA'
                               component={ RangeSlider }
                               description='High School GPA'
                               defaultRange={ { minValue: 0, maxValue: 100 } }
                               min={ 0 }
                               form={this}
                               max={ 100 }
                               step={ 1 } />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} style={{ marginTop: 10 }}>
                        <RaisedButton type='submit' label='Filter' primary={ true } />
                    </Col>
                </Row>
            </form>
        );
    }
}
// a unique name for this form
ChartFilter = reduxForm({
    form: 'chartFilterStudents'
})(ChartFilter);

const mapStateToProps = (state) => ({
    students: state.students.value
});

export default connect(mapStateToProps)(ChartFilter);
