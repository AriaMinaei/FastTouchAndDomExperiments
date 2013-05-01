define(['./monitor/el'], function(El) {
  var Monitor;

  return Monitor = (function() {
    function Monitor() {
      this.container = document.createElement('div');
      this.container.classList.add('monitor');
      this._deployed = false;
      this._data = {};
    }

    Monitor.prototype.deploy = function(into) {
      if (into == null) {
        into = document.querySelector('body');
      }
      if (!this._deployed) {
        into.appendChild(this.container);
        this._deployed = true;
      }
      return this;
    };

    Monitor.prototype.set = function(name, value) {
      if (!this._data[name]) {
        this._createEl(name);
      }
      this._data[name].value = value;
      this._data[name].el.set(value);
      return this;
    };

    Monitor.prototype._createEl = function(name) {
      if (this._data[name]) {
        throw Error("Duplicate element for '" + name + "'");
      }
      this._data[name] = {
        value: 0,
        name: name,
        el: new El(name)
      };
      this.container.appendChild(this._data[name].el.el);
      return this;
    };

    Monitor.get = function() {
      if (!this.instance) {
        this.instance = new Monitor;
      }
      return this.instance;
    };

    return Monitor;

  })();
});

/*
//@ sourceMappingURL=monitor.map
*/
