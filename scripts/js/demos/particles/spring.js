define(['../../../../js/demos/particles/spring/field', 'domReady'], function(SpringField, domReady) {
  return domReady(function() {
    var field;

    return field = new SpringField(document.querySelector('.field'), {
      particleMargin: 60,
      forces: {
        spring: {
          intensity: 0
        },
        damper: {
          intensity: 100
        },
        mouse: {
          radius: 300,
          intensity: -92000
        }
      }
    });
  });
});

/*
//@ sourceMappingURL=spring.map
*/
