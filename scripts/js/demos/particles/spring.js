define(['../../../../js/demos/particles/spring/field', 'domReady'], function(SpringField, domReady) {
  return domReady(function() {
    var field;

    return field = new SpringField(document.querySelector('.field'), {
      particleMargin: 60,
      forces: {
        spring: {
          intensity: 80000
        },
        damper: {
          intensity: 700
        },
        mouse: {
          radius: 100,
          intensity: 150000
        }
      }
    });
  });
});

/*
//@ sourceMappingURL=spring.map
*/
