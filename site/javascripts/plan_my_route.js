var PlanMyRoute = {}

var extensions = {
  first: function() {return this[0]},
  last: function() {return this[this.length - 1]}
}

for (var name in extensions) {
  Array.implement(name, extensions[name]);
  Elements.implement(name, extensions[name]);
}
