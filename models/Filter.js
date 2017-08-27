var Filter = function (name, path, handler) {
  this.name = name;
  this.path = path;
  this.handler = handler;
  this.value = null;

  return this;
}

export default Filter;
