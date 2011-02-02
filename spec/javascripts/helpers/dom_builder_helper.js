var buildDOM = function(containerId) {
  var container = new Element('div', {id: containerId}),
      form = new Element('form', {action: '/', method: 'get'}),
      startContainer = new Element('div', {'class': 'start'}),
      start = new Element('input', {
        id: 'starting_address', name: 'starting_address',
        placeholder: 'Starting Address', type: 'text', value: ''
      }),
      set = new Element('div', {'class': 'set'}),
      addresses = new Element('div', {'class': 'addresses'}),
      buttons = new Element('div', {'class': 'buttons'}),
      button = new Element('button', {type: 'submit'}),
      spinner = new Element('div', {'class': 'spinner hide'}),
      mapContainer = new Element('div', {'class': 'hide', id: 'google_map'});
  
  startContainer.adopt(set.clone().adopt(start))
  addresses.adopt(newAddress(set.clone(), 1), newAddress(set.clone(), 2), newAddress(set.clone(), 3), newAddress(set.clone(), 4))
  button.appendText('Plan My Route')
  buttons.adopt(button, spinner)
  
  form.adopt(startContainer, addresses, buttons)
  
  container.adopt(form, mapContainer)
  
  var page = new Element('div', {id: 'page'}),
      main = new Element('div', {id: 'main'}),
      content = new Element('div', {id: 'content'}),
      wrap = new Element('div', {'class': 'wrap'})
  
  wrap.adopt(container)
  content.adopt(wrap)
  main.adopt(content)
  page.adopt(main)
  $(document.body).adopt(page)
}

var newAddress = function(set, number) {
  var name = 'address' + number
  var input = new Element('input', {
    id: name, 'class': 'address', name: name,
    placeholder: name, type: 'text', value: ''
  }), makeFirst = new Element('div', {'class': 'action make_first'}),
      add = new Element('div', {'class': 'action add'}),
      remove = new Element('div', {'class': 'action remove'});
  set.adopt(input, makeFirst, add, remove);
  return set;
}

var teardownDOM = function() {
  $('page').dispose();
}