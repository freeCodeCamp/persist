import React from 'react';
import { TextField, Chip } from 'material-ui';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Field } from 'redux-form';

export default class Chips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chipData: [],
            fieldValue: ''
        };
        this.styles = {
            chip: {
                margin: 4
            },
            wrapContainer: {
                display: 'flex',
                flexDirection: 'column'
            },
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: 256
            }
        };
        this.key = 0;
        this.fieldName = this.props.field.dbName.toString();
    }

    componentWillMount() {
        const initValue = this.props.input.value || [];
        const chipData = initValue.map((ele, i) => {
            return {
                key: i,
                label: ele
            };
        });
        this.key = chipData.length;
        this.setState({
            ...this.state,
            chipData: chipData
        });
    }

    handleRequestDelete(key) {
        const { form } = this.props;
        const chipData = this.state.chipData;
        const chipToDelete = Array.from(chipData, chip => chip.key).indexOf(key);
        chipData.splice(chipToDelete, 1);
        const chips = Array.from(chipData, data => data.label);
        form.props.change.bind(form, this.fieldName, chips)();

        this.setState({
            ...this.state,
            chipData
        });
    }

    renderChip(data) {
        return (
            <Chip key={data.key} onRequestDelete={this.handleRequestDelete.bind(this, data.key)} style={this.styles.chip}>
                {data.label}
            </Chip>
        );
    }

    handleAdd() {
        const { form } = this.props;
        const { chipData } = this.state;
        let { fieldValue } = this.state;
        fieldValue = fieldValue.trim();
        if (fieldValue.length < 1) return;

        chipData.push({
            key: this.key,
            label: fieldValue
        });
        this.key += 1;

        const chips = Array.from(chipData, data => data.label);
        form.props.change.bind(form, this.fieldName, chips)();
        this.setState({
            chipData,
            fieldValue: ''
        });
    }

    render() {
        const { state, styles, props } = this;
        return (
            <div style={styles.wrapContainer}>
                <div className="chips" style={styles.wrapper}>
                    {state.chipData.map(this.renderChip, this)}
                </div>
                <div className="textField" style={{ position: 'relative' }}>
                    <TextField
                        name={`${this.fieldName}-add-chips`}
                        disabled={props.disabled}
                        floatingLabelText={props.field.displayName}
                        value={state.fieldValue}
                        onChange={(e, v) => {
                            this.setState({ ...state, fieldValue: v });
                        }}
                    />
                    <FloatingActionButton style={{ position: 'absolute', bottom: 10 }} mini={true} onClick={() => this.handleAdd()}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>
        );
    }
}
