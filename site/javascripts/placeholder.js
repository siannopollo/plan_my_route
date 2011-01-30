/*
---
description: Provides a fallback for the placeholder property on input elements for older browsers.

license:
  - MIT-style license

authors:
  - Matthias Schmidt (http://www.m-schmidt.eu)
  https://github.com/MSchmidt/mootools-form-placeholder
version:
  - 1.2

requires:
  core/1.2.5: '*'

provides:
  - Form.Placeholder

...
*/
(function(){

if (!this.Form) this.Form = {};

var supportsPlaceholder = ('placeholder' in document.createElement('input'));
if (!('supportsPlaceholder' in this) && this.supportsPlaceholder !== false && supportsPlaceholder) {
  this.Form.Placeholder = new Class({});
  return;
}

this.Form.Placeholder = new Class({
  Implements: Options,
  options: {
    className: 'placeholder',
    clearOnSubmit: false
  },
  initialize: function(element, options) {
    this.setOptions(options);
    this.element = $(element);
    
    this.placeholder = this.element.get('placeholder');
    this.is_password = this.element.get('type') == 'password' ? true : false;
    
    this.activatePlaceholder();

    this.element.addEvents({
      'focus': function() {
        this.deactivatePlaceholder();
      }.bind(this),
      'blur': function() {
        this.activatePlaceholder();
      }.bind(this)
    });
    
    if (this.element.getParent('form') && this.options.clearOnSubmit) {
      this.element.getParent('form').addEvent('submit', function(e){
        if (this.element.get('value') == this.placeholder) {
          this.element.set('value', '');
        }
      }.bind(this));
    }
  },
  activatePlaceholder: function() {
    if (this.element.get('value') == '' || this.element.get('value') == this.placeholder) {
      if (this.is_password) {
        this.element.set('type', 'text');
      }
      this.element.addClass(this.options.className);
      this.element.set('value', this.placeholder);
    }
  },
  deactivatePlaceholder: function() {
    if (this.element.get('value') == this.placeholder) {
      if (this.is_password) {
        this.element.set('type', 'password');
      }
      this.element.set('value', '');
      this.element.removeClass(this.options.className);
    }
  }
});

Element.addEvent(window, 'load', function(event) {
  $$('input[placeholder]').each(function(input) {
    new Form.Placeholder(input);
  });
});

})();