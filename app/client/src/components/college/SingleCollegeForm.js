import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { RaisedButton, Snackbar } from 'material-ui';
import keyBy from 'lodash/keyBy';
import { Button, Form, Row, Alert, Col, Clearfix } from 'react-bootstrap';
import FormGroup from '../helpers/ReduxFormGroup';
import * as updateCollege from '../../actions/updateCollege';
import CollegeAssociation from './CollegeAssociation';
import { collegeKeys } from '../../../../common/fieldKeys';
const collegeKeysObj = keyBy(collegeKeys, 'dbName');

class SingleCollegeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            notification: {
                success: false,
                error: false
            },
            filteredStudents: []
        };
    }

    handleFormSubmit(collegeRecord) {
        //this will handle updates
        console.log('this is our form object', collegeRecord);
        this.props.updateCollege(collegeRecord);
        this.setState({
            editable: !this.state.editable
        });
    }

    toggleEdit() {
        this.setState({
            editable: !this.state.editable
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateCollegeStatus.error) {
            this.setState({
                ...this.state,
                notification: {
                    error: true,
                    success: false
                }
            });
        } else if (nextProps.updateCollegeStatus.success) {
            this.setState({
                ...this.state,
                notification: {
                    error: false,
                    success: true
                }
            });
        }
    }

    render() {
        const { handleSubmit, reset, initialValues } = this.props;
        const { editable, filteredStudents } = this.state;
        const renderFormGroups = (form, collegeKeys) => {
            const HTML = [];
            collegeKeys.map((field, i) => {
                field = collegeKeysObj[field];
                let disabled = !editable;
                if (!field.editable) {
                    disabled = true;
                }
                const initialValue = initialValues[field.dbName];
                HTML.push(
                    <Col
                        key={field.dbName}
                        style={{ minHeight: 100, display: 'flex', justifyContent: 'center' }}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                    >
                        <FormGroup
                            form={form}
                            floatingLabelStyle={field.multiLineLabel ? { top: '16px' } : {}}
                            style={{ width: '384px' }}
                            initValue={initialValue}
                            key={i}
                            disabled={disabled}
                            field={field}
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
        };
        const basicCollegeInfo = [
            'website',
            'city',
            'state',
            'locale',
            'collType',
            'durationType',
            'hbcu',
            'religiousAffiliation',
            'specialPrograms',
            'otherNotes',
            'womenOnly'
        ];
        const academicProfile = [
            'avgHsGpa',
            'barronsRating',
            'percentileCR25',
            'percentileCR75',
            'admissionsRate',
            'testingPolicy',
            'percentileMath25',
            'percentileMath75',
            'gradRate.overall',
            'gradRate.black',
            'gradRate.white',
            'gradRate.hispanic'
        ];
        const percentDegrees = [
            'percentDegrees1',
            'percentDegrees2',
            'percentDegrees3',
            'percentDegrees4',
            'percentDegrees5',
            'percentDegrees6',
            'percentDegrees7',
            'percentDegrees8',
            'percentDegrees9',
            'percentDegrees10',
            'percentDegrees11',
            'percentDegrees12',
            'percentDegrees13',
            'percentDegrees14',
            'percentDegrees15',
            'percentDegrees16'
        ];
        const financialProfile = ['netPriceCalculator', 'netPrice0to30', 'netPrice30to48', 'netPrice48to75', 'netPrice75to110'];
        const studentBody = [
            'numberStudents',
            'percentPartTimeEnrolled',
            'percentFirstGen',
            'percentPellGrant',
            'percentStudents.black',
            'percentStudents.hispanic',
            'percentStudents.asian',
            'percentStudents.white'
        ];

        return (
            <div id="single-college-page">
                <Form className="single-student-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <Row className="text-right">
                        {editable ? <RaisedButton label="Submit" type="submit" primary={true} /> : null}
                        {editable ? (
                            <RaisedButton label="Undo" secondary={true} onClick={reset} />
                        ) : (
                            <RaisedButton label="Edit" primary={true} onClick={() => this.toggleEdit()} />
                        )}
                    </Row>
                    <h2>Basic College Information</h2>
                    <Row>{renderFormGroups(this, basicCollegeInfo)}</Row>
                    <h2>Academic Profile</h2>
                    <Row>{renderFormGroups(this, academicProfile)}</Row>
                    <h2>Percentage of Degrees Earned in the Following Fields</h2>
                    <Row>{renderFormGroups(this, percentDegrees)}</Row>
                    <h2>Financial Profile</h2>
                    <Row>{renderFormGroups(this, financialProfile)}</Row>
                    <h2>Student Body</h2>
                    <Row>{renderFormGroups(this, studentBody)}</Row>
                    <Snackbar
                        bodyStyle={{ backgroundColor: 'red' }}
                        open={this.state.notification.error}
                        message="Something went wrong. Please try again"
                        autoHideDuration={2000}
                        onRequestClose={() => {
                            this.setState({ ...this.state, notification: { success: false, error: false } });
                        }}
                    />
                    <Snackbar
                        bodyStyle={{ backgroundColor: 'green' }}
                        open={this.state.notification.success}
                        message="College record is updated"
                        autoHideDuration={2000}
                        onRequestClose={() => {
                            this.setState({ ...this.state, notification: { success: false, error: false } });
                        }}
                    />
                </Form>
                <CollegeAssociation college={initialValues} />
            </div>
        );
    }
}

SingleCollegeForm = reduxForm({
    form: 'SingleCollege' // a unique name for this form
})(SingleCollegeForm);

const mapStateToProps = state => ({
    updateCollegeStatus: state.updateCollege,
    students: state.students
});

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps, updateCollege)(SingleCollegeForm);
