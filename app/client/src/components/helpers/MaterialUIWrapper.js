import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();

const MaterialUIWrapper = ({ children }) => (
    <MuiThemeProvider>
        {children}
    </MuiThemeProvider>
);

export default MaterialUIWrapper;
