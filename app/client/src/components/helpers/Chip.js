import React from 'react';
import Chip from 'material-ui/Chip';
import { TextField } from 'redux-form-material-ui';
import { Field } from 'redux-form';

export default class Chips extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chipData: [],
      chipValue: '',
      newValue: ''
    };
    this.styles = {
      chip: {
        margin: 4
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    };
  }

  handleRequestDelete = (key) => {
    this.chipData = this.state.chipData;
    const newChipData = this.state.chipData.filter((chip) => {
      return chip.key !== key;
    });
    let chips = Array.from(newChipData, data => data.label);
    this.dispatchChange(this.props.meta.dispatch, chips);
    this.setState({
      chipData: newChipData
    });
  };

  dispatchChange(dispatch, chips) {
    dispatch({
      type: 'redux-form/CHANGE',
      meta: {
        form: 'SingleStudent',
        field: 'tags'
      },
      payload: chips.join(',')
    });
  }

  renderChip(data) {
    return (
      <Chip key={ data.key } onRequestDelete={ this.handleRequestDelete.bind(this, data.key) } style={ this.styles.chip }>
        { data.label }
      </Chip>
      );
  }

  updateChips(form, event) {
    let chips = event.target.value.toString();
    chips = chips.trim().split(/\s*,\s*/);

    let chipData = this.state.chipData;
    let length = this.state.chipData.length;
    chips.map((chip, i) => {
      if (chip.length > 0) {
        chipData.push({
          key: i + length,
          label: chip
        });
      }
    });
    chips = Array.from(chipData, data => data.label);
    this.dispatchChange(this.props.meta.dispatch, chips);
    this.setState({
      chipData: chipData,
      newValue: ''
    });
  }

  handleChange(event) {
    this.setState({
      newValue: event.target.value
    });
  }

  render() {
    return (
      <div style={ this.styles.wrapper }>
        { this.state.chipData.map(this.renderChip, this) }
        <TextField name='chips'
          value={ this.state.newValue }
          component={ TextField }
          floatingLabelText={ this.props.field.displayName }
          onBlur={ this.updateChips.bind(this, this) }
          onChange={ this.handleChange.bind(this) } />
        <Field name={ this.props.field.dbName.toString() }
          component={ TextField }
          floatingLabelText={ this.props.field.displayName }
          style={ { display: 'none' } } />
      </div>
      );
  }
}