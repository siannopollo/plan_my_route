PlanMyRoute.Address = new Class({
  initialize: function(element, route, start) {
    this.element = element;
    this.route = route;
    this.start = start || false;
    
    this.geocoder = this.route.geocoder;
    
    this.container = this.element.getParent('.set');
    this.makeFirstTrigger = this.container.getElement('.make_first');
    this.addAddressTrigger = this.container.getElement('.add');
    this.removeTrigger = this.container.getElement('.remove');
    
    this.latlng = null, this.latitude = null, this.longitude = null,
    this.first = false, this.error = false;
    
    this.observeElements();
  },
  
  addAddress: function(event) {
    this.route.createAddressAfter(this);
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
    return !!this.route.addressLocationCache[this.cachedLocationKey()];
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
    if (this.hasText() && !this.isCurrentLocationCached()) {
      this.geocoder.geocode({'address': this.text()}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          this.setLatLng(results[0].geometry.location);
          this.route.cacheAddressLocation(this);
        } else this.markError();
      }.bind(this));
    }
  },
  
  setLatLng: function(latlng) {
    this.latlng = latlng
    this.latitude = this.latlng.lat();
    this.longitude = this.latlng.lng();
  },
  
  setLocationFromGeocodeResult: function(result) {
    this.setLatLng(new google.maps.LatLng(result.coords.latitude, result.coords.longitude));
    
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
});