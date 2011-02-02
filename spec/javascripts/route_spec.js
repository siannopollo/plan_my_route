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
  })
  
  describe('Address', function() {
    var address
    beforeEach(function() {
      address = route.addresses[2]
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
    
    it('should retrieve coordinates from the text', function() {
      expect(address.latlng).toBeNull()
      
      address.retrieveCoordinates()
      expect(address.latlng).toBeNull()
      
      address.element.set('value', '1600 Pennsylvania Avenue NW, Washington, DC')
      runs(function() {
        address.retrieveCoordinates()
      })
      waits(500)
      runs(function() {
        expect(address.latlng).not.toBeNull()
        expect(address.latitude).toEqual(38.8976964)
        expect(address.longitude).toEqual(-77.0365191)
      })
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
})