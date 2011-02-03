PlanMyRoute.Route = new Class({
  initialize: function(container) {
    this.container = container;
    this.geocoder = new PlanMyRoute.Geocoder();
    this.addressLocationCache = {};
    
    this.registerAddresses();
    this.startingAddress = this.addresses[0];
    // this.assignStartingAddressLocation();
    
    this.form = this.container.getFirst('form');
    this.trigger = this.form.getFirst('.buttons button');
    this.spinner = this.form.getElement('.buttons .spinner');
    
    this.observeElements();
  },
  
  cacheAddressLocation: function(address) {
    if (address.latlng) this.addressLocationCache[address.cachedLocationKey()] = address.latlng;
  },
  
  createAddressAfter: function(existingAddress) {
    var newContainer = existingAddress.container.clone();
    existingAddress.container.grab(newContainer, 'after');
    var input = newContainer.getElement('input'); input.set('value', '');
    this.registerAddress(new PlanMyRoute.Address(input, this));
    
    this.reorderPlaceholders();
  },
  
  assignStartingAddressLocation: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(result) {
        this.startingAddress.setLocationFromGeocodeResult(result);
      }.bind(this));
    }
  },
  
  observeElements: function() {
    this.form.addEvent('submit', function(event) {event.stop()});
    this.trigger.addEvent('click', this.plan.bind(this));
  },
  
  plan: function(event) {
    this.spinner.removeClass('hide');
    this.addresses.each(function(address) {
      address.retrieveCoordinates();
    })
  },
  
  registerAddress: function(address) {
    this.addresses.push(address);
  },
  
  registerAddresses: function() {
    this.addresses = [];
    
    this.registerAddress(new PlanMyRoute.Address($$('#planning .start input')[0], this, true))
    $$('input.address').each(function(input) {
      this.registerAddress(new PlanMyRoute.Address(input, this));
    }.bind(this));
  },
  
  reorderPlaceholders: function() {
    var i = 1;
    this.form.getElements('.addresses input').each(function(input) {
      input.set('name', 'address' + i);
      input.set('id', 'address' + i);
      input.set('placeholder', 'Address ' + i);
      if (input.hasClass('placeholder')) input.set('value', 'Address ' + i);
      i++;
    });
  }
});