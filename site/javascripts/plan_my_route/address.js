PlanMyRoute.Address = new Class({
  initialize: function(element, route, start) {
    this.element = element;
    this.route = route;
    this.start = start || false;
    
    this.coordinates = null, this.latitude = null, this.longitude = null,
    this.first = false, this.error = false;
    
    if (this.start) this.addStartMethods();
    
    this.geocoder = this.route.geocoder;
    this.container = this.element.getParent('.set');
    this.assignElements();
    
    this.observeElements();
  },
  
  addAddress: function(event) {
    this.route.createAddressAfter(this);
  },
  
  addStartMethods: function() {
    for (var name in PlanMyRoute.Address.StartMethods) {
      this[name] = PlanMyRoute.Address.StartMethods[name].bind(this);
    }
  },
  
  assignElements: function() {
    this.makeFirstTrigger = this.container.getElement('.make_first');
    this.addAddressTrigger = this.container.getElement('.add');
    this.removeTrigger = this.container.getElement('.remove');
  },
  
  cachedLocationKey: function() {
    if (!this.hasText()) return '';
    return this.text().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  },
  
  distanceFrom: function(otherAddress) {
    return this.geocoder.distanceFrom(this).to(otherAddress);
  },
  
  hasText: function() {
    var text = this.text();
    if (text == '' || text == this.element.get('placeholder')) return false;
    return true;
  },
  
  isCurrentLocationCached: function() {
    if (!this.hasText()) return false;
    return !!this.geocoder.addressLocationCache[this.cachedLocationKey()];
  },
  
  isPlottable: function() {
    if (!this.coordinates) return false;
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
    this.makeFirstTrigger.addEvent('click', this.makeFirst.bind(this));
    this.addAddressTrigger.addEvent('click', this.addAddress.bind(this));
    this.removeTrigger.addEvent('click', this.remove.bind(this));
  },
  
  remove: function(event) {
    if (this.start) return false;
    if (this.route.addresses.length <= 2) return false;
    
    this.container.dispose();
    this.route.addresses.erase(this);
    this.route.reorderPlaceholders();
  },
  
  retrieveCoordinates: function() {
    if (this.hasText() && !this.isCurrentLocationCached()) {
      this.geocoder.geocodeFromAddress(this.text(), function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var latLng = results[0].geometry.location;
          this.setCoordinates(latLng.lat(), latLng.lng());
          this.geocoder.cacheAddressLocation(this);
        } else this.markError();
      }.bind(this));
    }
  },
  
  setCoordinates: function(latitude, longitude) {
    this.coordinates = new PlanMyRoute.Coordinates(latitude, longitude);
    this.latitude = this.coordinates.latitude;
    this.longitude = this.coordinates.longitude;
  },
  
  text: function() {
    return this.element.get('value').trim();
  }
});

PlanMyRoute.Address.StartMethods = {
  assignElements: function() {},
  observeElements: function() {},
  
  disable: function() {
    this.container.addClass('busy');
    this.element.set('disabled', 'disabled');
  },
  
  enable: function() {
    this.container.removeClass('busy');
    this.element.erase('disabled');
  },
  
  setCoordinatesFromCurrentLocation: function(result) {
    this.setCoordinates(result.coords.latitude, result.coords.longitude);
    
    this.geocoder.geocodeFromCoordinates(this.coordinates, function(results, status) {
      this.enable();
      
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[2]) {
          var display = 'Here - ' + results[2].formatted_address;
          this.element.set('value', display.replace(/, USA/, ''));
          this.element.removeClass('placeholder');
        }
      }
    }.bind(this));
  },
  
  retrieveCurrentCoordinates: function() {
    if (navigator.geolocation) {
      this.disable();
      
      navigator.geolocation.getCurrentPosition(function(result) {
        this.setCoordinatesFromCurrentLocation(result);
      }.bind(this));
    }
  }
}