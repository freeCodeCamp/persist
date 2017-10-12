import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class ShowList extends Component {
    constructor(props) {
        super(props);
    }

    onClickHandler(event) {
        this.props.onClick(event.target.textContent);
    }

    render() {
        var _this = this;
        var listItems = this.props.listItems.map(listItem => {
            return <ListItem primaryText={listItem} key={listItem} onClick={_this.onClickHandler.bind(_this)} />;
        });
        return (
            <MuiThemeProvider>
                <List>{listItems}</List>
            </MuiThemeProvider>
        );
    }
}
