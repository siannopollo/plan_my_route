PlanMyRoute = {
  Address: new Class({
    initialize: function(element, route, start) {
      this.element = element;
      this.route = route;
      this.start = start || false;
      
      this.geocoder = this.route.geocoder;
      
      this.container = this.element.getParent('.set');
      this.makeFirstTrigger = this.container.getElement('.make_first');
      this.addAddressTrigger = this.container.getElement('.add');
      this.removeTrigger = this.container.getElement('.remove');
      
      this.latlng = null,
      this.first = false;
      this.error = false;
      
      this.observeElements();
    },
    
    addAddress: function(event) {
      this.route.createAddressAfter(this);
    },
    
    distanceFrom: function(otherAddress) {
      return google.maps.geometry.spherical.computeDistanceBetween(this.latlng, otherAddress.latlng);
    },
    
    hasText: function() {
      var text = this.text();
      if (text == '' || text == this.element.get('placeholder')) return false;
      return true;
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
    
    markError: function() {
      this.container.addClass('error');
      this.error = true;
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
    
    retrieveCoordinates: function() {
      if (this.hasText()) {
        this.geocoder.geocode({'address': this.text()}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            this.latlng = results[0].geometry.location;
          } else {
            this.markError();
          }
        }.bind(this));
      }
    },
    
    setLocationFromGeocodeResult: function(result) {
      this.latlng = new google.maps.LatLng(result.coords.latitude, result.coords.longitude);
      
      this.geocoder.geocode({'latLng': this.latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[2]) {
            var display = 'Here - ' + results[2].formatted_address;
            this.element.set('value', display.replace(/, USA/, ''));
            this.element.removeClass('placeholder');
          }
        }
      }.bind(this));
    },
    
    text: function() {
      return this.element.get('value').trim();
    }
  }),
  
  Route: new Class({
    initialize: function(container) {
      this.container = container;
      this.geocoder = new google.maps.Geocoder();
      
      this.registerAddresses();
      this.startingAddress = this.addresses[0];
      // this.assignStartingAddressLocation();
      
      this.form = this.container.getFirst('form');
      this.trigger = this.form.getFirst('.buttons button');
      this.spinner = this.form.getElement('.buttons .spinner');
      
      this.observeElements();
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
        console.log(input)
        input.set('name', 'address' + i);
        input.set('id', 'address' + i);
        input.set('placeholder', 'Address ' + i);
        if (input.hasClass('placeholder')) input.set('value', 'Address ' + i);
        i++;
      });
    }
  })
}

