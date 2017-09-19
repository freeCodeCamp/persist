import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { getBackups, restoreDatabase } from '../../actions';
import { Permission } from '../authentication';
import { IconButton } from 'material-ui';
import { ActionSettingsBackupRestore } from 'material-ui/svg-icons';
import Content from '../helpers/content';

class Recovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backups: []
        };
    }

    componentDidMount() {
        this.props.getBackups().then((backups = []) => {
            this.setState({
                backups
            });
        });
    }

    restore(backup) {
        this.props.restoreDatabase(backup.Key);
    }

    renderTableBody() {
        const { backups } = this.state;
        const backupsHTML = backups.map((backup, i) => {
            return (
                <tr key={i}>
                    <td>{backup.momentDate.format('LL')}</td>
                    <td>
                        <IconButton onClick={() => this.restore(backup)}>
                            <ActionSettingsBackupRestore />
                        </IconButton>
                    </td>
                </tr>
            );
        });
        return <tbody>{backupsHTML}</tbody>;
    }

    render() {
        const { backups } = this.state;
        const tableHead = (
            <thead>
                <tr>
                    <th>Date</th>
                    <th />
                </tr>
            </thead>
        );
        return (
            <Permission role="Owner">
                <Content title="Recovery">
                    {backups.length > 0 ? (
                        <Table responsive condensed>
                            {tableHead}
                            {this.renderTableBody()}
                        </Table>
                    ) : null}
                </Content>
            </Permission>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getBackups,
            restoreDatabase
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(Recovery);
