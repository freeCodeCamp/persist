import React, {Component} from 'react';
import _ from 'lodash';
import {
    EthnicityChart,
    HSGradYear,
    ColDirEnrol,
    ColCompRate,
    ColPersist,
    ColType,
    GradRate,
    SemEnrol,
    AvgTimeGrad
} from './';

class ChartTabs extends Component {

    constructor(props) {
        super(props);
        this.tabList = {
            colDirEnrol: 'College Direct Enrollment',
            ethnicity: 'Ethnicity',
            hsGradYear: 'HS Grad Year',
            colCompRate: 'College Completion Rate',
            colPersist: 'College Persistence',
            colType: 'College Type',
            gradRate: 'Graduation Rate',
            semEnrol: 'Semester by Semester Enrollment',
            avgTimeGrad: 'Average time to Graduation'
        };
        this.state = {
            activeId: null
        };
    }

    componentDidMount() {
        const ele = $(this.tabs).find('li').first();
        ele.addClass('active');
        const id = ele.data('id');
        this.setState({
            activeId: id
        });
    }

    renderTabContent() {
        const { students, colleges } = this.props;
        const id = this.state.activeId;
        const props = { id, students, colleges, active: true };
        switch (id) {
            case 'hsGradYear':
                return <HSGradYear {...props} />;
            case 'ethnicity':
                return <EthnicityChart {...props} />;
            case 'colDirEnrol':
                return <ColDirEnrol {...props} />;
            case 'colCompRate':
                return <ColCompRate {...props} />;
            case 'colPersist':
                return <ColPersist {...props} />;
            case 'colType':
                return <ColType {...props} />;
            case 'gradRate':
                return <GradRate {...props} />;
            case 'semEnrol':
                return <SemEnrol {...props} />;
            case 'avgTimeGrad':
                return <AvgTimeGrad {...props} />;
            default:
                return null;
        }
    }

    handleClicked(e) {
        const id = $(e.target).closest('li').data('id');
        this.setState({
            activeId: id
        });
    }

    renderTabs() {
        const keys = _.keys(this.tabList);
        return keys.map(tab => {
            return (
                <li key={tab} data-toggle='tab' data-id={tab} onClick={(e) => this.handleClicked(e)}>
                    <a>{this.tabList[tab]}</a></li>
            );
        });
    }

    render() {
        return (
            <div className="nav-tabs-custom">
                {/* Tabs within a box */}
                <ul className="nav nav-tabs pull-right ui-sortable-handle" ref={(c) => this.tabs = c}>
                    {this.renderTabs()}
                    <li className="pull-left header"><i className="fa fa-inbox"></i>Filters</li>
                </ul>
                <div className="tab-content no-padding">
                    {/* Charts */}
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default ChartTabs;
