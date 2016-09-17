import { renderComponent, expect } from '../test_helper';
import CommentList from '../../src/components/comment_list';


describe('CommentList', () => {

	let component;
	const firstComment = 'first comment';
	const secondComment = 'second comment';


	beforeEach(() => {
		const state = { comments : [firstComment, secondComment] };
		component = renderComponent(CommentList, null, state);
	});

	it('shows an LI for each comment', () => {
		expect(component.find('li').length).to.equal(2);
	});

	it('shows each comment that is provided', () => {

		//HIS IDEA
		expect(component).to.contain(firstComment);
		expect(component).to.contain(secondComment);
	});


});