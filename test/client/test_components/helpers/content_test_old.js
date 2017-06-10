import { renderComponent, expect } from '../../test_helper';
import Content from '../../../app/client/src/components/helpers/content';

describe('Content', () => {
    let component;

    beforeEach(() => {
        const props = {
            children: 'test'
        };

        component = renderComponent(Content, props);
    });

    it('has correct class', () => {
        expect(component).to.have.class('content-provider');
    });

    it('shows content header', () => {
        expect(component.find('.content-header')).to.exist;
    });

    it('shows a content section', () => {
        expect(component.find('.content')).to.exist;
    });

    it('renders children in content section', () => {
        expect(component.find('.content')).to.contain('test');
    });
});
