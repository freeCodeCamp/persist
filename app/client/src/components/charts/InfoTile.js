import React from 'react';

var InfoTile = React.createClass({
    getDefaultProps: function() {
        return {
            content: '',
            icon: 'fa-star-o',
            stats: '0',
            subject: 'Default Subject',
            theme: 'bg-aqua',
            width: 6
        };
    },
    render: function() {
        if (this.props.children) {
            return (
                <div className={'col-md-' + this.props.width + ' col-sm-6 col-xs-12'}>
                    <div className={'info-box ' + this.props.theme}>
                        <span className="info-box-icon">
                            <i className={'fa ' + this.props.icon} />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">{this.props.subject}</span>
                            <span className="info-box-number">{this.props.stats}</span>
                            {this.props.children}
                        </div>

                        {this.props.content}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={'col-md-' + this.props.width + ' col-sm-6 col-xs-12'}>
                    <div className="info-box">
                        <span className={'info-box-icon ' + this.props.theme}>
                            <i className={'fa ' + this.props.icon} />
                        </span>

                        <div className="info-box-content">
                            <span className="info-box-text">{this.props.subject}</span>
                            <span className="info-box-number">{this.props.stats}</span>
                        </div>

                        {this.props.content}
                    </div>
                </div>
            );
        }
    }
});

export default InfoTile;
