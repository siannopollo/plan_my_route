describe('Route', function() {
  var route, geocoder
  
  beforeEach(function() {
    buildDOM('planning');
    PlanMyRoute.Geocoder = PlanMyRoute.DefaultGeocoder
    
    route = new PlanMyRoute.Route($('planning'));
    geocoder = route.geocoder
  })
  
  afterEach(function() {
    teardownDOM();
    PlanMyRoute.Geocoder = StubbedGeocoder
  })
  
  it('should cache an addresses location', function() {
    address = route.startingAddress
    address.element.set('value', '1600 Pennsylvania Ave, Washington DC')
    address.coordinates = new PlanMyRoute.Coordinates(38.23242, -77.379793)
    
    expect(address.isCurrentLocationCached()).toEqual(false)
    
    geocoder.cacheAddressLocation(address)
    
    var key = '1600pennsylvaniaavewashingtondc'
    expect(address.isCurrentLocationCached()).toEqual(true)
    expect(geocoder.addressLocationCache[key]).toBe(address.coordinates)
  });
  
  it('should calculate the distance between two addresses', function() {
    address1 = route.startingAddress
    address1.coordinates = new PlanMyRoute.Coordinates(37.235, -115.811111)
    
    address2 = route.addresses[2]
    address2.coordinates = new PlanMyRoute.Coordinates(37.33182, -122.03118)
    
    expect(geocoder.distanceFrom(address1).to(address2)).toEqual(550925.090317494)
    expect(geocoder.distanceFrom(address2).to(address1)).toEqual(550925.090317494)
  });
  
  it('should not calculate the distance if one or both addresses are missing coordinates', function() {
    address1 = route.startingAddress
    address1.coordinates = new PlanMyRoute.Coordinates(37.235, -115.811111)
    
    address2 = route.addresses[2]
    expect(address2.coordinates).toBeNull()
    
    expect(geocoder.distanceFrom(address1).to(address2)).toBeNull()
    expect(geocoder.distanceFrom(address2).to(address1)).toBeNull()
    
    address1.coordinates = null
    expect(geocoder.distanceFrom(address1).to(address2)).toBeNull()
  });
})