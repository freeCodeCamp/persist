import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import PropTypes from 'prop-types'
import { OPEN_NAME_EDIT, CLOSE_NAME_EDIT } from '../../../actions/types';
import { updateUserName } from '../../../actions';

function trySubmission(firstName, lastName, props) {
	let first = $('#first-name');
	let newFirstName = first.val();
	if (!newFirstName) {
		first.prop('placeholder', 'cannot be empty');
		return;
	}
	let newLastName = $('#last-name').val();
	// don't trigger the server unnecessarily, lastname could be null not '' 
	if (newFirstName == firstName && newLastName == (lastName? lastName: '')) {
		props.closeNameEdit();
		return;
	}
	props.submitNameChange(newFirstName, newLastName);
}

const HeaderUser = (props) => {
	const { user: { firstName, lastName } } = props;
	return (
		<li className="dropdown user user-menu">
			<a 
				className="dropdown-toggle"
				onClick={(e) => {
					$('.user-menu').toggleClass('open'); 
					props.closeNameEdit();
					e.stopPropagation();}
				}
			>
				<img src="/default-profile-pic.png" className="user-image" alt="User Image" />
				<span className="hidden-xs">{`${firstName} ${lastName || ''}`.trim()}</span>
			</a>
			<ul className="dropdown-menu">
				{/* User image */}
				<li className="user-header">
					<img src="/default-profile-pic.png" className="img-circle" alt="User Image" />
					{/* Dropdown for name display / edit */}
					{props.editIsOpen? (
						<div onKeyDown = { (e) => {
							console.log(e.keyCode)
							if (e.keyCode == 13) { trySubmission(firstName, lastName, props); }
							else if (e.keyCode == 27) { props.closeNameEdit() }
						}}>
							<input type='text' defaultValue={firstName} placeholder={'First Name'} id='first-name'/>
							<input type='text' defaultValue={lastName} placeholder={lastName? '': 'Last Name'} id='last-name' />
							<div
								className='btn btn-default'
								onClick={props.closeNameEdit}
							>Cancel</div>
							<div 
								className='btn btn-default'
								onClick={() => trySubmission(firstName, lastName, props)}
							>Update Name</div>
						</div>
					):(
						<div>
							<div onClick={props.openNameEdit}>
								<i className="fa fa-pencil" />
							</div>
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
HeaderUser.PropTypes = {
	firstName: PropTypes.string.isRequired,
	lastName: PropTypes.string,
	editIsOpen: PropTypes.bool.isRequired,
	openNameEdit: PropTypes.func.isRequired,
	closeNameEdit: PropTypes.func.isRequired,
	submitNameChange: PropTypes.func.isRequired
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
		submitNameChange: (firstName, lastName) => dispatch(updateUserName(firstName, lastName))
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUser);