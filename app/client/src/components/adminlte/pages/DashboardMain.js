import React from 'react';
import InfoTile from '../charts/InfoTile'

class DashboardMain extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
        	<div>
        		<h1>Welcome</h1>
                <InfoTile icon='fa-envelope-o' subject="Users" stats="1000" theme="bg-aqua" width={3}/>
                <InfoTile icon='fa-flag-o' subject="Students" stats="1000" theme="bg-red" width={3}/>
                <InfoTile icon='fa-star-o' subject="Schools" stats="1000" theme="bg-yellow" width={3}/> 
        	</div>
        	);
    }
}

export default DashboardMain;
