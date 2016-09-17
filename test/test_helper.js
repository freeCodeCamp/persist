import _$ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import jsdom from 'jsdom';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from '../src/reducers';

//sets up jsdom
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = global.window.navigator;
const $ = _$(window);

//configs chaijquery
chaiJquery(chai, chai.util, $);

//renders component with provider for store
function renderComponent(ComponentClass, props = {}, state = {}) {
  
  //props and state required for connect component
  //create store on provider
  //add props to component

  const componentInstance =  TestUtils.renderIntoDocument(
    <Provider store={createStore(reducers, state)}>
      <ComponentClass {...props} />
    </Provider>
  );

  return $(ReactDOM.findDOMNode(componentInstance));
}

$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value);
  }

  //this uses react test utils from html from jquery
  //simulate.event(node)
  //this just gets first element in array in case of selecting multiople
  TestUtils.Simulate[eventName](this[0]);
};

export {renderComponent, expect};
