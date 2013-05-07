define(['../../../../js/demos/particles/spring/field', 'domReady'], function(SpringField, domReady) {
  return domReady(function() {
    var field;

    return field = new SpringField(document.querySelector('.field'), {
      particleMargin: 80,
      forces: {
        spring: {
          intensity: 20000
        },
        damper: {
          intensity: 3000
        },
        attractor: {
          radius: 15000,
          intensity: 420000
        }
      }
    });
  });
});

/*
//@ sourceMappingURL=spring.map
*/
