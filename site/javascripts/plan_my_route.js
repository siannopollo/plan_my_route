PlanMyRoute = {
  Address: new Class({
    initialize: function(element, route, start) {
      this.element = element;
      this.route = route;
      this.start = start || false;
      
      this.container = this.element.getParent('.set');
      this.makeFirstTrigger = this.container.getElement('.make_first');
      this.addAddressTrigger = this.container.getElement('.add');
      this.removeTrigger = this.container.getElement('.remove');
      
      this.latitude = null,
      this.longitude = null;
      this.first = false;
      
      this.observeElements();
    },
    
    addAddress: function(event) {
      this.route.createAddressAfter(this);
    },
    
    makeFirst: function(event) {
      this.route.addresses.each(function(address) {
        if (address != this) {
          address.container.removeClass('first');
          address.first = false;
        }
      }.bind(this));
      this.container.toggleClass('first');
      this.first = !this.first;
    },
    
    observeElements: function() {
      if (!this.start) {
        this.makeFirstTrigger.addEvent('click', this.makeFirst.bind(this));
        this.addAddressTrigger.addEvent('click', this.addAddress.bind(this));
        this.removeTrigger.addEvent('click', this.remove.bind(this));
      }
    },
    
    remove: function(event) {
      if (this.start) return false;
      if (this.route.addresses.length <= 2) return false;
      
      this.container.dispose();
      this.route.addresses.erase(this);
      this.route.reorderPlaceholders();
    },
    
    setLocationFromGeocodeResult: function(result) {
      this.latitude = result.centroid.latitude;
      this.longitude = result.centroid.longitude;
      
      var city = result.locality1.content,
          state = result.admin1.content,
          zip = result.postal.content;
      this.cachedDisplay = 'Here - ' + city + ', ' + state + ' ' + zip;
      this.element.set('value', this.cachedDisplay);
      this.element.removeClass('placeholder');
    }
  }),
  
  Route: new Class({
    initialize: function(container) {
      this.container = container;
      this.registerAddresses();
      
      this.startingAddress = this.addresses[0];
      // this.assignStartingAddressLocation();
      
      this.form = this.container.getFirst('form');
      this.trigger = this.form.getFirst('.buttons button');
      
      this.observeElements();
    },
    
    createAddressAfter: function(existingAddress) {
      var html = this.addressTemplate.substitute({'index': this.addresses.length});
    },
    
    assignStartingAddressLocation: function() {
      new MooGeo('visitor', {onComplete: function(result) {
        result = result.place;
        this.startingAddress.setLocationFromGeocodeResult(result);
       }.bind(this)});
    },
    
    observeElements: function() {
      this.form.addEvent('submit', function(event) {event.stop()});
      this.trigger.addEvent('click', this.plan.bind(this));
    },
    
    plan: function(event) {
      console.log('here');
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
      this.addresses.each(function(address) {
        if (!address.start) {
          var input = address.element;
          input.set('name', 'address' + i);
          input.set('placeholder', 'Address ' + i);
          if (input.hasClass('placeholder')) input.set('value', 'Address ' + i);
          i++;
        }
      });
    }
  })
}

