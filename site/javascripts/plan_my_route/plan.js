PlanMyRoute.Plan = new Class({
  initialize: function(route) {
    this.route = route;
    this.geocoder = this.route.geocoder;
    this.addresses = [];
    
    this.geocodeAddresses();
    this.selectPlottableAddresses();
    this.orderAddresses();
  },
  
  geocodeAddresses: function() {
    this.route.addresses.each(function(address) {
      address.retrieveCoordinates();
    });
  },
  
  orderAddresses: function() {
    if (this.addresses.contains(this.route.startingAddress)) {
      this.sortedAddresses = [this.route.startingAddress];
      this.addresses.erase(this.route.startingAddress);
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