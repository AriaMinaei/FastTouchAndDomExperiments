var __slice = [].slice;

require(['domReady', 'graphics/fastMatrix', 'native'], function(domReady, FastMatrix) {
  var body, cellEl, columnEl, createGroup, getColumn, group, groupEl, groupTitleEl, titleEl;
  body = null;
  cellEl = document.createElement('div');
  cellEl.classList.add('cell');
  titleEl = document.createElement('div');
  titleEl.classList.add('title');
  columnEl = document.createElement('div');
  columnEl.classList.add('column');
  getColumn = function(title, before, after) {
    var c, column, index, t, value, _i, _len;
    column = columnEl.cloneNode();
    t = titleEl.cloneNode();
    t.innerHTML = title;
    column.appendChild(t);
    for (index = _i = 0, _len = before.length; _i < _len; index = ++_i) {
      value = before[index];
      c = cellEl.cloneNode();
      c.innerHTML = index;
      c.setAttribute('title', after[index]);
      if (value !== after[index]) {
        c.classList.add('different');
      }
      column.appendChild(c);
    }
    return column;
  };
  groupEl = document.createElement('div');
  groupEl.classList.add('group');
  groupTitleEl = document.createElement('h2');
  groupTitleEl.classList.add('title');
  createGroup = function() {
    var array, arrays, before, group, pair, t, title, _i, _len;
    title = arguments[0], arrays = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    group = groupEl.cloneNode();
    t = groupTitleEl.cloneNode();
    t.innerHTML = title;
    group.appendChild(t);
    for (_i = 0, _len = arrays.length; _i < _len; _i++) {
      pair = arrays[_i];
      title = pair[0];
      array = pair[1];
      if (!before) {
        group.appendChild(getColumn(title, array, array));
        before = Array.clone(array);
      } else {
        group.appendChild(getColumn(title, before, array));
        before = Array.clone(array);
      }
    }
    return group;
  };
  group = function() {
    return body.appendChild(createGroup.apply(this, arguments));
  };
  return domReady(function() {
    var autoGroup, dummy, getMatrix, transforms;
    body = document.querySelector('body');
    transforms = {
      rotate3d: 'rotate3d(0.1, 0.2, 0.3, 32deg)',
      scale3d: 'scale3d(0.9, 0.8, 0.7)',
      translate3d: 'translate3d(10px, 11px, 12px)',
      skew: 'skew(7deg, 8deg)',
      perspective: 'perspective(400)'
    };
    dummy = document.createElement('div');
    body.appendChild(dummy);
    getMatrix = function() {
      var components, s, style;
      components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      s = components.join(' ');
      dummy.style.webkitTransform = s;
      style = getComputedStyle(dummy).webkitTransform;
      return (new FastMatrix(style)).r;
    };
    autoGroup = function() {
      var comp, components, matrix, params, soFar, _i, _len;
      components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      params = ['', ['identity', FastMatrix.identity()]];
      soFar = [];
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        comp = components[_i];
        soFar.push(transforms[comp]);
        matrix = getMatrix.apply(this, soFar);
        params.push(['+' + comp, matrix]);
      }
      return group.apply(this, params);
    };
    body.appendChild(document.createElement('hr'));
    autoGroup('rotate3d');
    autoGroup('perspective', 'rotate3d');
    autoGroup('scale3d', 'rotate3d');
    autoGroup('skew', 'rotate3d');
    autoGroup('translate3d', 'rotate3d');
    body.appendChild(document.createElement('hr'));
    autoGroup('translate3d');
    autoGroup('perspective', 'translate3d');
    autoGroup('scale3d', 'translate3d');
    autoGroup('skew', 'translate3d');
    autoGroup('rotate3d', 'translate3d');
    body.appendChild(document.createElement('hr'));
    autoGroup('skew');
    autoGroup('perspective', 'skew');
    autoGroup('scale3d', 'skew');
    autoGroup('rotate3d', 'skew');
    autoGroup('translate3d', 'skew');
    body.appendChild(document.createElement('hr'));
    autoGroup('scale3d');
    autoGroup('perspective', 'scale3d');
    autoGroup('skew', 'scale3d');
    autoGroup('rotate3d', 'scale3d');
    autoGroup('translate3d', 'scale3d');
    body.appendChild(document.createElement('hr'));
    autoGroup('perspective');
    autoGroup('scale3d', 'perspective');
    autoGroup('skew', 'perspective');
    autoGroup('rotate3d', 'perspective');
    return autoGroup('translate3d', 'perspective');
  });
});
