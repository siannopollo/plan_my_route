describe('Plan', function() {
  var route, plane;
  
  beforeEach(function() {
    buildDOM('planning');
    route = new PlanMyRoute.Route($('planning'))
    setDestinations()
    plan = new PlanMyRoute.Plan(route)
  })
  
  var setDestinations = function() {
    var startingAddress = route.startingAddress
    startingAddress.element.set('value', '2050 Clark ave, Raleigh, NC 27605') // (35.7889986, -78.6602142)
    startingAddress.coordinates = new PlanMyRoute.Coordinates(35.7889986, -78.6602142)
    route.geocoder.cacheAddressLocation(startingAddress)
    
    var addresses = route.addresses.slice(1,5),
        destinations = []
    destinations.push(['4625 Mill Rock Lane Raleigh NC', 35.833747, -78.561106]) // #3 destination (35.833747, -78.561106)
    destinations.push(['4204 Reavis Road, Raleigh, NC 27606', 35.785561, -78.696288]) // #1 destination (35.785561, -78.696288)
    destinations.push(['1812 Trinity Rd. Raleigh, NC 27607', 35.805262, -78.744983]) // #2 destination (35.805262, -78.744983)
    destinations.each(function(destinationGroup) {
      var index = Math.floor(Math.random() * addresses.length)
      var address = addresses[index];
      address.element.set('value', destinationGroup[0])
      address.coordinates = new PlanMyRoute.Coordinates(destinationGroup[1], destinationGroup[2])
      route.geocoder.cacheAddressLocation(address)
      
      addresses.erase(address)
    })
  }
  
  afterEach(function() {
    teardownDOM();
  })
  
  it('should have some defaults', function() {
    expect(plan.route).toBe(route)
    expect(plan.addresses).toBeDefined()
  });
  
  it('should order the addresses', function() {
    expect(plan.addresses.length).toEqual(0)
    plan.geocodeAddresses()
    
    expect(plan.addresses.length).toEqual(4)
    expect(plan.addresses[0].text()).toEqual('2050 Clark ave, Raleigh, NC 27605')
    expect(plan.addresses[1].text()).toEqual('4204 Reavis Road, Raleigh, NC 27606')
    expect(plan.addresses[2].text()).toEqual('1812 Trinity Rd. Raleigh, NC 27607')
    expect(plan.addresses[3].text()).toEqual('4625 Mill Rock Lane Raleigh NC')
  });
  
  it('should take into account the first destination', function() {
    route.addresses.each(function(address) {
      if (address.text() == '1812 Trinity Rd. Raleigh, NC 27607') address.first = true
    })
    
    plan.geocodeAddresses()
    
    expect(plan.addresses.length).toEqual(4)
    expect(plan.addresses[0].text()).toEqual('2050 Clark ave, Raleigh, NC 27605')
    expect(plan.addresses[1].text()).toEqual('1812 Trinity Rd. Raleigh, NC 27607')
    expect(plan.addresses[2].text()).toEqual('4204 Reavis Road, Raleigh, NC 27606')
    expect(plan.addresses[3].text()).toEqual('4625 Mill Rock Lane Raleigh NC')
  });
})