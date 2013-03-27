var define;

if (typeof define !== 'function') {
  define = require('amdefine')(module);
}

define(['graphics/fastMatrix'], function(FastMatrix) {
  var DommyStylesTransform;
  return DommyStylesTransform = (function() {

    function DommyStylesTransform(dommy, fastId, el) {
      this.dommy = dommy;
      this.fastId = fastId;
      if (this.original = this.dommy._get(this.fastId, 'style.transform.original')) {
        this.current = this.dommy._get(this.fastId, 'style.transform.current');
        this.temp = this.dommy._get(this.fastId, 'style.transform.temp');
      } else {
        this.original = new FastMatrix(getComputedStyle(el).webkitTransform);
        this.dommy._set(this.fastId, 'style.transform.original', this.original);
        this.current = this.original.copy();
        this.dommy._set(this.fastId, 'style.transform.current', this.current);
        this.temp = this.original.copy();
        this.dommy._set(this.fastId, 'style.transform.temp', this.temp);
      }
      this.active = 1;
    }

    DommyStylesTransform.prototype.temporarily = function() {
      this.temp.fromMatrix(this.current);
      this.active = 0;
      return this.temp;
    };

    DommyStylesTransform.prototype.originally = function() {
      this.active = 2;
      return this.original;
    };

    DommyStylesTransform.prototype.currently = function() {
      this.active = 1;
      return this.current;
    };

    DommyStylesTransform.prototype.apply = function(el) {
      switch (this.active) {
        case 0:
          el.style.webkitTransform = this.temp.toString();
          break;
        case 1:
          el.style.webkitTransform = this.current.toString();
          break;
        case 2:
          el.style.webkitTransform = this.original.toString();
      }
      return this;
    };

    DommyStylesTransform.prototype.commit = function(el) {
      this.apply(el);
      switch (this.active) {
        case 0:
          this.current.fromMatrix(this.temp);
          break;
        case 2:
          this.current.fromMatrix(this.original);
      }
      this.active = 1;
      return this;
    };

    DommyStylesTransform.prototype.revertToCurrent = function(el) {
      this.currently();
      return this.commit(el);
    };

    DommyStylesTransform.prototype.revertToOriginal = function(el) {
      this.originally();
      return this.commit(el);
    };

    return DommyStylesTransform;

  })();
});
