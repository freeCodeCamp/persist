import React, { Component } from 'react';

import { Table } from 'react-bootstrap';

export default class CollegeSummary extends Component {
    render() {
        const { recentCollege, hsGPA, studentSupport, majorMinor, remediation, transferStatus } = this.props.summary;

        return (
            <div id="college-summary">
                <Table bordered>
                    <thead>
                        <tr>
                            <th colSpan="4">
                                <h4 style={{ textAlign: 'center' }}>College Summary</h4>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="key">Most Recent College</td>
                            <td className="value">{recentCollege}</td>
                            <td className="key">Major/Minor</td>
                            <td className="value">{majorMinor}</td>
                        </tr>
                        <tr>
                            <td className="key">HS GPA</td>
                            <td className="value">{hsGPA}</td>
                            <td className="key">Remediation</td>
                            <td className="value">{remediation}</td>
                        </tr>
                        <tr>
                            <td className="key">Student Support Program</td>
                            <td className="value">{studentSupport}</td>
                            <td className="key">Transfer Status</td>
                            <td className="value">{transferStatus}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}
