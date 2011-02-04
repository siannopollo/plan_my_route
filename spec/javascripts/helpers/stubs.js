var StubbedGeocoder = new Class({
  initialize: function() {
    this.defaultCoordinates = null;
    this.error = false;
    this.addressLocationCache = {};
  },
  
  cacheAddressLocation: function(address) {
    if (address.coordinates) this.addressLocationCache[address.cachedLocationKey()] = address.coordinates;
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

var fakeGetCurrentPosition = function(callback) {
  var defaultResults = {
    coords: {latitude: this.defaultLatitude, longitude: this.defaultLongitude}
  }
  if (this.shouldPerform) callback(defaultResults)
}

navigator.geolocation.oldGetCurrentPosition = navigator.geolocation.getCurrentPosition
navigator.geolocation.getCurrentPosition = fakeGetCurrentPosition
