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
})