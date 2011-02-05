PlanMyRoute.Map = new Class({
  initialize: function(route, container) {
    this.route = route;
    this.container = container;
    
    this.element = this.container.getElement('.map')
    this.directionsPanel = this.container.getElement('.driving_directions')
    
    this.mapInitiated = false;
    this.mapLoaded = false;
    this.resetSources();
  },
  
  correctDirectionsMarkers: function() {
    setTimeout(function() {
      var images = this._sortImages(this.directionsPanel.getElements('img[src*=_green]'));
      if (!this.unwantedSrc.directions) this.unwantedSrc.directions = images.last().src;
      if (!this.desiredSrc.directions) this.desiredSrc.directions = images.first().src;
      
      images.each(function(img) {
        if (img.src == this.unwantedSrc.directions) img.src = this.desiredSrc.directions;
      }.bind(this));
      
      if (this.mapLoaded) this.correctMapMarkers(true);
    }.bind(this), 1000);
  },
  
  correctMapMarkers: function(skipTimeout) {
    var correction = function() {
      var images = this._sortImages(this.element.getElements('img[src*=_green]'));
      if (!this.unwantedSrc.map) this.unwantedSrc.map = images.last().src;
      if (!this.desiredSrc.map) this.desiredSrc.map = images.first().src;
      
      images.each(function(img) {
        if (img.src == this.unwantedSrc.map) img.src = this.desiredSrc.map;
      }.bind(this));
    }.bind(this);
    
    if (skipTimeout) correction();
    else setTimeout(correction, 1000);
  },
  
  resetSources: function() {
    this.desiredSrc = {map: null, directions: null};
    this.unwantedSrc = {map: null, directions: null};
  },
  
  mapDidLoad: function() {
    this.mapLoaded = true;
  },
  
  plotAddresses: function(addresses, callback) {
    this.container.removeClass('hide');
    this.resetSources();
    
    if (!this.mapInitiated) {
      this.map = new google.maps.Map(this.element, {
        center: addresses[0].coordinates.latlng, mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
      });
      this.renderer = new google.maps.DirectionsRenderer({
        draggable: true, map: this.map, panel: this.directionsPanel,
        markerOptions: {draggable: false}
      });
      
      google.maps.event.addListener(this.renderer, 'directions_changed', this.correctDirectionsMarkers.bind(this));
      google.maps.event.addListener(this.map, 'tilesloaded', this.mapDidLoad.bind(this));
      google.maps.event.addListener(this.map, 'idle', this.correctMapMarkers.bind(this));
      
      this.mapInitiated = true
    }
    
    new google.maps.DirectionsService().route(this.request(addresses), function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) this.renderer.setDirections(result);
        
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
    
    parameters['origin'] = home.text();
    parameters['destination'] = home.text();
    
    waypoints.each(function(address) {
      parameters.waypoints.push({
        location: address.text(), stopover: true
      });
    });
    
    return parameters;
  },
  
  _sortImages: function(images) {
    var sources = images.map(function(img) {return img.src}),
        sortedImages = [];
    sources = sources.sort();
    sources.each(function(src) {
      images.each(function(img) {
        if (img.src == src) sortedImages.push(img);
      });
    });
    
    return sortedImages;
  }
})