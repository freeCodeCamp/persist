import React, { Component } from 'react';

import { Table } from 'reactstrap';

export default class CollegeTermRecords extends Component {
	render() {

        const rows = this.props.terms.map((term, i) => {
            return (
                <tr key={i}>
                    <td className='value'>{term.college}</td>
                    <td className='value'>{term.name}</td>
                    <td className='value'>{term.status}</td>
                    <td className='value'>DATA NEEDED</td>
                    <td className='value'>DATA NEEDED</td>
                </tr>
                );             
        });


		return (
				<div id='college-term-records'>
					<Table bordered style={{maxHeight: '200px'}}>
                    <thead>
                      <tr>
                        <th colSpan='5'><h4 style={{textAlign: 'center'}}>College Term Records</h4></th>
                      </tr>

                      <tr>
                        <th>School</th>
                        <th>Term</th>
                        <th>Status</th>
                        <th>Credits Attempted</th>
                        <th>Credits Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                    	{rows}
                    </tbody>
                  </Table>
				</div>
		);
	}
}
