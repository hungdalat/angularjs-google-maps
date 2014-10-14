  app.controller('LayerDataQuakesAdvCtrl', function($scope) {
    function interpolateHsl(lowHsl, highHsl, fraction) {
      var color = [];
      for (var i = 0; i < 3; i++) {
        // Calculate color based on the fraction.
        color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
      }

      return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
    }
    $scope.styleFunc = function(feature) {
      var low = [151, 83, 34];   // color of mag 1.0
      var high = [5, 69, 54];  // color of mag 6.0 and above
      var minMag = 1.0;
      var maxMag = 6.0;

      // fraction represents where the value sits between the min and max
      var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) /
          (maxMag - minMag);

      var color = interpolateHsl(low, high, fraction);

      return {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeWeight: 0.5,
          strokeColor: '#fff',
          fillColor: color,
          fillOpacity: 2 / feature.getProperty('mag'),
          // while an exponent would technically be correct, quadratic looks nicer
          scale: Math.pow(feature.getProperty('mag'), 2)
        },
        zIndex: Math.floor(feature.getProperty('mag'))
      };
    };
  });
