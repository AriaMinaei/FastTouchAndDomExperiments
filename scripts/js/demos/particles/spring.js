define(['../../../../js/demos/particles/spring/field', 'domReady'], function(SpringField, domReady) {
  return domReady(function() {
    var field;

    return field = new SpringField(document.querySelector('.field'), {
      particleMargin: 80,
      forces: {
        spring: {
          intensity: 8000
        },
        damper: {
          intensity: 500
        },
        attractor: {
          radius: 500,
          intensity: 920000
        },
        tornado: {
          radius: 1500,
          intensity: 900000,
          direction: 1
        }
      }
    });
  });
});

/*
//@ sourceMappingURL=spring.map
*/
