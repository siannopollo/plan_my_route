/*description: Provides a fallback for the placeholder property on input elements for older browsers.

license:
  - MIT-style license

authors:
  - Matthias Schmidt (http://www.m-schmidt.eu)
  https://github.com/MSchmidt/mootools-form-placeholder
provides:
  - Form.Placeholder*/
(function(){if(!this.Form){this.Form={}}var a=("placeholder" in document.createElement("input"));if(!("supportsPlaceholder" in this)&&this.supportsPlaceholder!==false&&a){this.Form.Placeholder=new Class({});return}this.Form.Placeholder=new Class({Implements:Options,options:{color:"#A9A9A9",clearOnSubmit:true},initialize:function(c,b){this.setOptions(b);this.element=$(c);this.placeholder=this.element.get("placeholder");this.original_color=this.element.getStyle("color");this.is_password=this.element.get("type")=="password"?true:false;this.activatePlaceholder();this.element.addEvents({focus:function(){this.deactivatePlaceholder()}.bind(this),blur:function(){this.activatePlaceholder()}.bind(this)});if(this.element.getParent("form")&&this.options.clearOnSubmit){this.element.getParent("form").addEvent("submit",function(d){if(this.element.get("value")==this.placeholder){this.element.set("value","")}}.bind(this))}},activatePlaceholder:function(){if(this.element.get("value")==""||this.element.get("value")==this.placeholder){if(this.is_password){this.element.set("type","text")}this.element.setStyle("color",this.options.color);this.element.set("value",this.placeholder)}},deactivatePlaceholder:function(){if(this.element.get("value")==this.placeholder){if(this.is_password){this.element.set("type","password")}this.element.set("value","");this.element.setStyle("color",this.original_color)}}})})();

Element.addEvent(window, 'load', function(event) {
  $$('input[placeholder]').each(function(input) {
    new Form.Placeholder(input);
  });
});
  
