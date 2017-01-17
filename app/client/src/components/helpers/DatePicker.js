import {Component, createElement} from 'react';
import DatePicker from 'material-ui/DatePicker';

// Creates a component class that renders the given Material UI component

// @param MaterialUIComponent The material ui component to render
// @param mapProps A mapping of props provided by redux-form to the props the Material UI
// component needs

function createComponent(MaterialUIComponent, mapProps) {
    class InputComponent extends Component {
        getRenderedComponent() {
            return this.refs.component;
        }

        render() {
            return createElement(MaterialUIComponent, {
                ...mapProps(this.props),
                ref: 'component'
            });
        }
    }
    InputComponent.displayName = `ReduxFormMaterialUI${MaterialUIComponent.name}`;
    return InputComponent;
}

const mapError = ({meta: {touched, error} = {}, input: {...inputProps}, ...props}, errorProp = 'errorText') => touched && error ? {
    ...props,
    ...inputProps,
    [errorProp]: error
} : {
    ...inputProps,
    ...props
};

export default createComponent(
    DatePicker,
    ({
        input: {
            onBlur, // eslint-disable-line no-unused-vars
            onChange,
            value,
            ...inputProps
        },
        ...props
    }) => ({
        ...inputProps,
        ...mapError(props),
        value: value && new Date(value) || null,
        onChange: (event, value) => onChange(value)
    })
);