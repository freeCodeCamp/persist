import React from 'react';
import Content from '../helpers/content';

class samplePage extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'samplePage';
    }
    render() {
        return (
            <Content>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Title</h3>
                        <div className="box-tools pull-right">
                            <button className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
                                <i className="fa fa-minus" />
                            </button>
                            <button className="btn btn-box-tool" data-widget="remove" data-toggle="tooltip" title="Remove">
                                <i className="fa fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="box-body">
                        Start creating your amazing application!
                    </div>
                    <div className="box-footer">
                        Footer
                    </div>
                </div>
            </Content>
        );
    }
}

export default samplePage;
