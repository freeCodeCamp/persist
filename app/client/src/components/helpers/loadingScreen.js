import React, { Component } from 'react';
import { connect } from 'react-redux';

class FullScreenLoader extends Component {
    render() {
        const fullPageStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%',
            zIndex: 10000,
            background: 'white',
            visibility: this.props.spinner ? 'visible' : 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.3
        };

        const loaderStyle = {
            fontSize: '100px',
            textAlign: 'center'
        };
        return (
            <div style={fullPageStyle}>
                <i style={loaderStyle} className="fa fa-refresh fa-spin" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        spinner: state.spinner.main || state.spinner.page
    };
};

export default connect(mapStateToProps)(FullScreenLoader);
