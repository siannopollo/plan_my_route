describe('Plan', function() {
  var route, plane;
  
  beforeEach(function() {
    buildDOM('planning');
    route = new PlanMyRoute.Route($('planning'))
    setDestinations()
    plan = new PlanMyRoute.Plan(route)
  })
  
  var setDestinations = function() {
    route.startingAddress.element.set('value', '2050 Clark ave, Raleigh, NC 27605')
    var addresses = route.addresses.slice(1,5),
        destinations = []
    destinations.push('4625 Mill Rock Lane Raleigh NC') // #3 destination
    destinations.push('4204 Reavis Road, Raleigh, NC 27606') // #1 destination
    destinations.push('1812 Trinity Rd. Raleigh, NC 27607') // #2 destination
    destinations.each(function(destination) {
      var index = Math.floor(Math.random() * addresses.length)
      var address = addresses[index];
      address.element.set('value', destination)
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
})