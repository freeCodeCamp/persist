import React, {Component} from 'react';
import {Accordion, Panel, Col, Row} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {RaisedButton} from 'material-ui';
import {Checkbox} from 'redux-form-material-ui';
import {studentKeys} from '../../../../common/fieldKeys';
import keyBy from 'lodash/keyBy';
import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';
const studentKeysObj = keyBy(studentKeys, 'dbName');

class ExportCSV extends Component {
    constructor(props) {
        super(props);
    }

    initiateExport(values) {
        const exportKeys = keys(pickBy(values, (v) => (v)));
        console.log(exportKeys);
    }

    render() {
        const {handleSubmit} = this.props;
        const exportKeys = keys(studentKeysObj);
        const exportKeysHTML = exportKeys.map((field, i) => {
            return (
                <Col xs={12} sm={6} md={4} lg={3} key={field}>
                    <Field
                        name={field}
                        component={Checkbox}
                        label={studentKeysObj[field].displayName}
                    />
                </Col>
            )
        });
        return (
            <Accordion>
                <Panel header='Export' eventKey='1'>
                    <form onSubmit={handleSubmit((v) => this.initiateExport(v))}>
                        <Row>
                            { exportKeysHTML }
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton type='submit' label='Export' primary={true}/>
                            </Col>
                        </Row>
                    </form>
                </Panel>
            </Accordion>
        );
    }
}

ExportCSV = reduxForm({
    form: 'ExportCSV'
})(ExportCSV);

export default ExportCSV;
