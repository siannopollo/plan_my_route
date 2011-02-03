PlanMyRoute.Geocoder = new Class({
  initialize: function() {
    this._geocoder = new google.maps.Geocoder();
    this._addressForDistance = null;
  },
  
  distanceFrom: function(address) {
    this._addressForDistance = address;
    return this;
  },
  
  geocode: function(options, callback) {
    return this._geocoder.geocode(options, callback)
  },
  
  to: function(address) {
    return google.maps.geometry.spherical.computeDistanceBetween(this._addressForDistance.latlng, address.latlng);
  }
});

PlanMyRoute.Coordinates = new Class({
  initialize: function(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    this._latlng = new google.maps.LatLng(this.latitude, this.longitude);
  }
})