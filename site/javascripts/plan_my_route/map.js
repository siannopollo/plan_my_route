PlanMyRoute.Map = new Class({
  initialize: function(route, element) {
    this.route = route;
    this.element = element;
  },
  
  plotAddresses: function(addresses, callback) {
    this.element.removeClass('hide');
    if (!this.map) this.map = new google.maps.Map(this.element, {
      center: addresses[0].coordinates.latlng, mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    if (this.renderer) this.renderer.setMap(null);
    
    var directionsService = new google.maps.DirectionsService();
    this.renderer = new google.maps.DirectionsRenderer({
      draggable: true, map: this.map
    });
    
    directionsService.route(this.request(addresses), function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        this.renderer.setDirections(result);
      }
        
      if (callback) callback();
    }.bind(this));
  },
  
  request: function(addresses) {
    var home = addresses[0],
        waypoints = addresses.slice(1, addresses.length),
        parameters = {
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          unitSystem: google.maps.DirectionsUnitSystem.IMPERIAL,
          waypoints: []
        };
    
    parameters['origin'] = home.coordinates.latlng;
    parameters['destination'] = home.coordinates.latlng;
    
    waypoints.each(function(address) {
      parameters.waypoints.push({
        location: address.coordinates.latlng, stopover: true
      });
    });
    
    return parameters;
  }
})