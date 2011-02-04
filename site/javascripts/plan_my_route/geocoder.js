PlanMyRoute.Geocoder = new Class({
  initialize: function() {
    this._geocoder = new google.maps.Geocoder();
    this._addressForDistance = null;
    this.addressLocationCache = {};
  },
  
  cacheAddressLocation: function(address) {
    if (address.coordinates) this.addressLocationCache[address.cachedLocationKey()] = address.coordinates;
  },
  
  distanceFrom: function(address) {
    this._addressForDistance = address;
    return this;
  },
  
  geocode: function(options, callback) {
    return this._geocoder.geocode(options, callback)
  },
  
  geocodeFromAddress: function(address, callback) {
    return this._geocoder.geocode({'address': address}, callback);
  },
  
  geocodeFromCoordinates: function(coordinates, callback) {
    return this._geocoder.geocode({'latLng': coordinates.latlng}, callback);
  },
  
  to: function(address) {
    var from = this._addressForDistance.coordinates,
        to = address.coordinates;
    if (from && to) {
      return google.maps.geometry.spherical.computeDistanceBetween(from.latlng, to.latlng);
    } else return null;
  }
});

PlanMyRoute.Coordinates = new Class({
  initialize: function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.latlng = new google.maps.LatLng(this.latitude, this.longitude);
  }
})