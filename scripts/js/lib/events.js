(function() {

  window.UIEvent.prototype.stop = function() {
    this.stopPropagation();
    return this.preventDefault();
  };

}).call(this);
