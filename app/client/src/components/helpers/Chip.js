import React from 'react';
import Chip from 'material-ui/Chip';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Field } from 'redux-form';

export default class Chips extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chipData: [],
            options: []
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
        let options = this.props.options;
        let initValue = this.props.input.value || [];
        options = options.filter(el => {
            return !initValue.includes(el);
        });

        let chipData = initValue.map((ele, i) => {
            return {
                key: i,
                label: ele
            };
        });
        this.key = chipData.length;
        this.setState({
            chipData: chipData,
            options: options
        });
    }

    handleRequestDelete(key) {
        const { form } = this.props;
        let chipData = this.state.chipData;
        const chipToDelete = Array.from(chipData, chip => chip.key).indexOf(key);
        let options = this.state.options;
        options.push(chipData[chipToDelete].label);
        chipData.splice(chipToDelete, 1);
        let chips = Array.from(chipData, data => data.label);
        form.props.change.bind(form, this.fieldName, chips)();

        this.setState({
            chipData: chipData,
            options: options
        });
    }

    renderChip(data) {
        return (
            <Chip key={data.key} onRequestDelete={this.handleRequestDelete.bind(this, data.key)} style={this.styles.chip}>
                {data.label}
            </Chip>
        );
    }

    handleChange(event, index, value) {
        const { form } = this.props;
        let options = this.state.options;
        options.splice(options.indexOf(value), 1);

        let chipData = this.state.chipData;

        if (value.toString().length > 1) {
            chipData.push({
                key: this.key,
                label: value
            });
            this.key += 1;
        }

        let chips = Array.from(chipData, data => data.label);
        form.props.change.bind(form, this.fieldName, chips)();

        this.setState({
            chipData: chipData,
            options: options
        });
    }

    render() {
        const { state, styles } = this;
        let optionsHTML = this.state.options.map(elem => {
            return <MenuItem key={elem} value={elem} primaryText={elem} />;
        });
        return (
            <div style={styles.wrapContainer}>
                <div className="chips" style={styles.wrapper}>
                    {state.chipData.map(this.renderChip, this)}
                </div>
                <div className="selectField">
                    <SelectField
                        name="chips"
                        maxHeight={200}
                        disabled={this.props.disabled}
                        floatingLabelText={this.props.field.displayName}
                        onChange={this.handleChange.bind(this)}
                    >
                        {optionsHTML}
                    </SelectField>
                </div>
            </div>
        );
    }
}
