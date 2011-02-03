describe('Route', function() {
  var route
  
  beforeEach(function() {
    buildDOM('planning');
    route = new PlanMyRoute.Route($('planning'));
  })
  
  afterEach(function() {
    teardownDOM();
  })
  
  it('should have some defaults', function() {
    expect(route.addresses.length).toEqual(5)
    expect(route.form).toBeDefined()
    expect(route.trigger).toBeDefined()
    expect(route.geocoder).toBeDefined()
    expect(route.addressLocationCache).toBeDefined()
  })
  
  it('should cache an addresses location', function() {
    address = route.startingAddress
    address.element.set('value', '123 Main St New York, NY 12345')
    address.latlng = new google.maps.LatLng(38.23242, -77.379793)
    
    expect(address.isCurrentLocationCached()).toEqual(false)
    
    route.cacheAddressLocation(address)
    
    var key = '123mainstnewyorkny12345'
    expect(address.isCurrentLocationCached()).toEqual(true)
    expect(route.addressLocationCache[key]).toBe(address.latlng)
  });
})