describe('Address', function() {
  var route, address;
  
  beforeEach(function() {
    buildDOM('planning');
    route = new PlanMyRoute.Route($('planning'));
    address = route.addresses[2]
  })
  
  afterEach(function() {
    teardownDOM();
  })
  
  it('should know the route', function() {
    expect(address.route).toBe(route)
  });
  
  it('should have the route geocoder', function() {
    expect(address.geocoder).toBe(route.geocoder)
  });
  
  it('should have defaults', function() {
    expect(address.container).toBeDefined()
    expect(address.start).toEqual(false)
    expect(address.makeFirstTrigger).not.toBeNull()
    expect(address.addAddressTrigger).not.toBeNull()
    expect(address.removeTrigger).not.toBeNull()
    expect(address.latlng).toBeNull()
    expect(address.first).toEqual(false)
    expect(address.error).toEqual(false)
  });
  
  describe('starting address', function() {
    beforeEach(function() {
      startingAddress = route.startingAddress
    })
    
    it('should have different defaults', function() {
      expect(startingAddress.container).toBeDefined()
      expect(startingAddress.start).toEqual(true)
      expect(startingAddress.makeFirstTrigger).toBeNull()
      expect(startingAddress.addAddressTrigger).toBeNull()
      expect(startingAddress.removeTrigger).toBeNull()
      expect(startingAddress.latlng).toBeNull()
      expect(startingAddress.first).toEqual(false)
      expect(startingAddress.error).toEqual(false)
    });
  })
  
  it('should be first after click the make first button', function() {
    expect(address.first).toEqual(false)
    address.makeFirstTrigger.fireEvent('click')
    expect(address.first).toEqual(true)
    address.makeFirstTrigger.fireEvent('click')
    expect(address.first).toEqual(false)
  });
  
  it('should not allow two addresses to be first at the same time', function() {
    otherAddress = route.addresses[1]
    expect(address.first).toEqual(false)
    expect(otherAddress.first).toEqual(false)
    
    address.makeFirstTrigger.fireEvent('click')
    expect(address.first).toEqual(true)
    expect(otherAddress.first).toEqual(false)
    
    otherAddress.makeFirstTrigger.fireEvent('click')
    expect(address.first).toEqual(false)
    expect(otherAddress.first).toEqual(true)
  });
  
  it('should add a new address to the form', function() {
    expect($$('.addresses input').length).toEqual(4)
    expect(route.addresses.length).toEqual(5)
    
    address.addAddressTrigger.fireEvent('click')
    expect($$('.addresses input').length).toEqual(5)
    expect(route.addresses.length).toEqual(6)
  });
  
  it('should be removed from the form', function() {
    expect($$('.addresses input').length).toEqual(4)
    expect(route.addresses.length).toEqual(5)
    
    address.removeTrigger.fireEvent('click')
    expect($$('.addresses input').length).toEqual(3)
    expect(route.addresses.length).toEqual(4)
  });
  
  it('should always leave at least one address plus the starting address', function() {
    for (var i = 0; i < 5; i++) {
      var removedAddress = route.addresses[1]
      
      removedAddress.removeTrigger.fireEvent('click')
      expect($$('.addresses input').length).toBeGreaterThan(0)
      expect(route.addresses.length).toBeGreaterThan(1)
    }
  });
  
  it('should have text', function() {
    expect(address.hasText()).toEqual(false)
    
    address.element.set('value', 'something')
    expect(address.hasText()).toEqual(true)
    
    address.element.set('value', address.element.get('placeholder'))
    expect(address.hasText()).toEqual(false)
  });
  
  it('should retrieve coordinates from the text and cache it', function() {
    address.geocoder.defaultCoordinates = new PlanMyRoute.Coordinates(38.123, -77.321)
    
    expect(address.coordinates).toBeNull()
    
    address.retrieveCoordinates()
    expect(address.coordinates).toBeNull()
    
    address.element.set('value', '1600 Pennsylvania Avenue NW, Washington, DC')
    address.retrieveCoordinates()
    
    expect(address.coordinates).not.toBeNull()
    expect(address.latitude).toEqual(38.123)
    expect(address.longitude).toEqual(-77.321)
    expect(address.isCurrentLocationCached()).toEqual(true)
  });
  
  it('should not geocode the address if it is already cached', function() {
    var latlng = new google.maps.LatLng(38.23242, -77.379793)
    address.element.set('value', '123 Main St New York, NY 12345')
    address.latlng = latlng
    route.cacheAddressLocation(address)
    
    spyOn(address.geocoder, 'geocode')
    
    address.retrieveCoordinates()
    expect(address.geocoder.geocode).not.toHaveBeenCalled()
  });
  
  it('should mark the address with an error if coordinates cannot be gotten from the text', function() {
    address.element.set('value', 'udsuidpbwbfi')
    runs(function() {
      address.retrieveCoordinates()
    })
    waits(500)
    runs(function() {
      expect(address.latlng).toBeNull()
      expect(address.latitude).toBeNull()
      expect(address.longitude).toBeNull()
      expect(address.error).toEqual(true)
    })
  });
})