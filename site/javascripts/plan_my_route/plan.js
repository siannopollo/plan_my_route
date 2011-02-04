PlanMyRoute.Plan = new Class({
  initialize: function(route) {
    this.route = route;
    this.addresses = [];
    // this.route.addresses.each(function(address) {
    //   address.retrieveCoordinates();
    //   if (address.latlng) this.addresses.push(address);
    // }.bind(this));
    
  }
});