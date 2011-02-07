PlanMyRoute.Plan = new Class({
  initialize: function(route) {
    this.route = route;
    this.geocoder = this.route.geocoder;
    this.map = this.route.map;
    
    this.addresses = [];
    this.totalGeocodeCount = 0;
    this.geocodeCount = 0;
  },
  
  execute: function(callback) {
    this.callbackAfterMapping = callback;
    this.geocodeAddresses();
  },
  
  geocodeAddresses: function() {
    this.totalGeocodeCount = this.route.addresses.length;
    this.geocodeCount = 0;
    
    this.route.addresses.each(function(address) {
      address.retrieveCoordinates(this.notifyGeocoding.bind(this));
    }.bind(this));
  },
  
  notifyGeocoding: function() {
    this.geocodeCount++;
    if (this.geocodeCount >= this.totalGeocodeCount) {
      this.totalGeocodeCount = 0;
      this.geocodeCount = 0;
      
      this.selectPlottableAddresses();
      if (this.route.isOptimized()) this.orderAddresses();
      
      if (this.addresses.length > 1) this.map.plotAddresses(this.addresses, this.callbackAfterMapping);
      else this.callbackAfterMapping();
    }
  },
  
  orderAddresses: function() {
    if (this.addresses.contains(this.route.startingAddress)) {
      this.sortedAddresses = [this.route.startingAddress];
      this.addresses.erase(this.route.startingAddress);
      
      if (this.route.firstAddress()) {
        var first = this.route.firstAddress();
        this.sortedAddresses.push(first);
        this.addresses.erase(first);
      }
      
      var times = this.addresses.length;
      
      for (var i = 0; i < times; i++) {
        var sorted = this.addresses.sort(this._sortingFunction.bind(this));
        var closestAddress = sorted[0];
        this.addresses.erase(closestAddress);
        this.sortedAddresses.push(closestAddress);
      }
      this.addresses = this.sortedAddresses;
    } else {
      // mark that the route is invalid
    }
  },
  
  selectPlottableAddresses: function() {
    this.route.addresses.each(function(address) {
      if (address.isPlottable()) this.addresses.push(address);
    }.bind(this))
  },
  
  _sortingFunction: function(a, b) {
    var lastAddress = this.sortedAddresses[this.sortedAddresses.length - 1];
    var aToLast = this.geocoder.distanceFrom(a).to(lastAddress),
        bToLast = this.geocoder.distanceFrom(b).to(lastAddress);
    return aToLast - bToLast;
  }
});