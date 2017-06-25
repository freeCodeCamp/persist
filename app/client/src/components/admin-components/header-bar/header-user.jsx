import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { OPEN_NAME_EDIT, CLOSE_NAME_EDIT } from '../../../actions/types';
import { updateUserName } from '../../../actions';

const HeaderUser = (props) => {
	const { user: { firstName, lastName } } = props;
	console.log(props.allProps)
	return (
		<li className="dropdown user user-menu">
			<a href="#" 
				className="dropdown-toggle"
				onClick={() => $('.user-menu').toggleClass('open')}
			>
				<img src="/default-profile-pic.png" className="user-image" alt="User Image" />
				<span className="hidden-xs">{`${firstName} ${lastName || ''}`.trim()}</span>
			</a>
			<ul className="dropdown-menu">
				{/* User image */}
				<li className="user-header">
					<img src="/default-profile-pic.png" className="img-circle" alt="User Image" />
					{props.editIsOpen? (
						<div id='dropdown-user-name'>
							<i 
								className="fa fa-male" 
								onClick={(ev) => {console.log(ev); ev.stopPropagation(); console.log('me'); props.closeNameEdit()}} 
							/>
						</div>
					):(
						<div id='dropdown-user-name'>
							<i 
								onClick={(ev) => {console.log(ev); ev.nativeEvent.stopImmediatePropagation(); ev.stopPropagation; console.log('you'); props.openNameEdit()}}
								className="fa fa-pencil" 
							/>
							<p>{`${firstName} ${lastName || ''}`.trim()}</p>
						</div>
					)}
				</li>
				{/* Menu Footer */}
				<li className="user-footer">
						<div style={{ textAlign: 'center' }}>
								<Link to="/logout" className="btn btn-default btn-flat">Sign out</Link>
						</div>
				</li>
			</ul>
		</li>
	);
}



const mapStateToProps = (state) => ({
		user: state.auth.user,
		editIsOpen: state.users.nameEditIsOpen
});

const mapDispatchToProps = (dispatch) => ({
		openNameEdit: () => dispatch({ 
				type: OPEN_NAME_EDIT
		}),
		closeNameEdit: () => dispatch({
				type: CLOSE_NAME_EDIT
		}),
		submitNameChange: (firstName, lastName) => updateUserName(firstName, lastName)
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUser);