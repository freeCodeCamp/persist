import React, { Component } from 'react';
import { axios } from '../../actions/utils';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { ActionOfflinePin, AlertError } from 'material-ui/svg-icons';
import { bindActionCreators } from 'redux';

class UploadHistory extends Component {
    constructor(props) {
        super(props);
        this.updating = false;
        this.length = 0;
        this.mounted = false;
        this.pages = 1;
        this.state = {
            history: [],
            page: 1
        };
    }

    componentDidMount() {
        this.mounted = true;
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.getHistory();
    }

    handleScroll() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 50) {
            this.getHistory();
        }
    }

    getHistory() {
        if (!this.mounted) return;
        const _this = this;
        const { page, history, pages } = this.state;
        if (this.updating || page > pages) return;
        this.updating = true;
        axios().get(`/getUploadHistory/${page}`).then(res => {
            _this.setState(
                {
                    page: page + 1,
                    history: [...history, ...res.data.docs],
                    pages: res.data.pages
                },
                () => {
                    _this.updating = false;
                }
            );
        });
    }

    renderLoading() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: 40
                }}
            >
                <i className="fa fa-cog fa-spin fa-3x fa-fw" />
            </div>
        );
    }

    componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    render() {
        const { history } = this.state;
        const { noSearch, counselors } = this.props;
        if (history.length < 1) {
            if (!noSearch) {
                return <h2 style={{ margin: 0, padding: 20, textAlign: 'center' }}>Sorry! no results found</h2>;
            }
            return this.renderLoading();
        }
        const historyHTML = history.map((hist, i) => {
            const { firstName, lastName } = counselors[hist.user].profile;
            return (
                <tr key={i}>
                    <td>
                        {i + 1}
                    </td>
                    <td>
                        {hist.type}
                    </td>
                    <td>
                        {moment(hist.when).fromNow()}
                    </td>
                    <td>
                        {`${firstName} ${lastName || ''}`.trim()}
                    </td>
                    <td>
                        {hist.source}
                    </td>
                    <td>
                        {hist.comments}
                    </td>
                    <td>
                        {hist.success ? <ActionOfflinePin color="green" /> : <AlertError color="red" />}
                    </td>
                </tr>
            );
        });

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            When
                        </th>
                        <th>
                            User
                        </th>
                        <th>
                            Upload Source
                        </th>
                        <th>
                            Upload Comments
                        </th>
                        <th>
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {historyHTML}
                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    counselors: state.counselors.idObj
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps)(UploadHistory);
