define(function() {
  var MonitorEl;

  return MonitorEl = (function() {
    function MonitorEl(title, value) {
      this.title = title;
      this.value = value != null ? value : 0;
      this._prepare();
    }

    MonitorEl.prototype._prepare = function() {
      this.el = document.createElement('div');
      this.el.classList.add('monitor-el');
      this._titleEl = document.createElement('span');
      this._titleEl.classList.add('monitor-el-title');
      this.el.appendChild(this._titleEl);
      this._updateTitle();
      this._valueEl = document.createElement('span');
      this._valueEl.classList.add('monitor-el-value');
      this.el.appendChild(this._valueEl);
      return this._updateValue();
    };

    MonitorEl.prototype._updateTitle = function() {
      return this._titleEl.innerHTML = this.title;
    };

    MonitorEl.prototype._updateValue = function() {
      return this._valueEl.innerHTML = this.value;
    };

    MonitorEl.prototype.set = function(value) {
      this.value = value;
      return this._updateValue();
    };

    return MonitorEl;

  })();
});

/*
//@ sourceMappingURL=el.map
*/
