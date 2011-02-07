var StubbedGeocoder = new Class({
  Extends: PlanMyRoute.Geocoder,
  
  initialize: function() {
    this.defaultCoordinates = null;
    this.error = false;
    this.addressLocationCache = {};
  },
  
  defaultLatLng: function() {
    if (this.defaultCoordinates) return new google.maps.LatLng(this.defaultCoordinates.latitude, this.defaultCoordinates.longitude);
    return null;
  },
  
  geocodeFromAddress: function(address, callback) {
    var results = [{geometry: {location: this.defaultLatLng()}}]
    callback(results, this.status())
  },
  
  geocodeFromCoordinates: function(coordinates, callback) {
    if (this.defaultReverseGeocodeAddress) {
      this.error = false
      var results = [null, null, {formatted_address: this.defaultReverseGeocodeAddress}]
    } else {
      this.error = true
      var results = []
    }
    callback(results, this.status())
  },
  
  status: function() {
    if (this.error) return google.maps.GeocoderStatus.ERROR;
    return google.maps.GeocoderStatus.OK;
  }
})
PlanMyRoute.DefaultGeocoder = PlanMyRoute.Geocoder
PlanMyRoute.Geocoder = StubbedGeocoder

StubbedMap = new Class({
  initialize: function(route, element) {
    this.route = route;
    this.element = element;
  },
  
  plotAddresses: function(addresses, callback) {
    if (callback) callback();
  }
})
PlanMyRoute.DefaultMap = PlanMyRoute.Map
PlanMyRoute.Map = StubbedMap
