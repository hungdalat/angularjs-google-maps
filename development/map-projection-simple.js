// Note: this value is exact as the map projects a full 360 degrees of longitude
var GALL_PETERS_RANGE_X = 800;

// Note: this value is inexact as the map is cut off at ~ +/- 83 degrees.
// However, the polar regions produce very little increase in Y range, so
// we will use the tile size.
var GALL_PETERS_RANGE_Y = 510;

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

/**
 * @constructor
 * @implements {google.maps.Projection}
 */
function GallPetersProjection() {

  // Using the base map tile, denote the lat/lon of the equatorial origin.
  this.worldOrigin_ = new google.maps.Point(GALL_PETERS_RANGE_X * 400 / 800,
      GALL_PETERS_RANGE_Y / 2);

  // This projection has equidistant meridians, so each longitude degree is a linear
  // mapping.
  this.worldCoordinatePerLonDegree_ = GALL_PETERS_RANGE_X / 360;

  // This constant merely reflects that latitudes vary from +90 to -90 degrees.
  this.worldCoordinateLatRange = GALL_PETERS_RANGE_Y / 2;
};

GallPetersProjection.prototype.fromLatLngToPoint = function(latLng) {

  var origin = this.worldOrigin_;
  var x = origin.x + this.worldCoordinatePerLonDegree_ * latLng.lng();

  // Note that latitude is measured from the world coordinate origin
  // at the top left of the map.
  var latRadians = degreesToRadians(latLng.lat());
  var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);

  return new google.maps.Point(x, y);
};

GallPetersProjection.prototype.fromPointToLatLng = function(point, noWrap) {

  var y = point.y;
  var x = point.x;

  if (y < 0) {
    y = 0;
  }
  if (y >= GALL_PETERS_RANGE_Y) {
    y = GALL_PETERS_RANGE_Y;
  }

  var origin = this.worldOrigin_;
  var lng = (x - origin.x) / this.worldCoordinatePerLonDegree_;
  var latRadians = Math.asin((origin.y - y) / this.worldCoordinateLatRange);
  var lat = radiansToDegrees(latRadians);
  return new google.maps.LatLng(lat, lng, noWrap);
};

var gallPetersMap;

var gallPetersMapType = new google.maps.ImageMapType({
  getTileUrl: function(coord, zoom) {
    var numTiles = 1 << zoom;

    // Don't wrap tiles vertically.
    if (coord.y < 0 || coord.y >= numTiles) {
      return null;
    }

    // Wrap tiles horizontally.
    var x = ((coord.x % numTiles) + numTiles) % numTiles;

    // For simplicity, we use a tileset consisting of 1 tile at zoom level 0
    // and 4 tiles at zoom level 1. Note that we set the base URL to a
    // relative directory.
    var baseURL = 'https://google-developers.appspot.com/maps/documentation/javascript/examples/full/images/';
    baseURL += 'gall-peters_' + zoom + '_' + x + '_' + coord.y + '.png';
    return baseURL;
  },
  tileSize: new google.maps.Size(800, 512),
  isPng: true,
  minZoom: 0,
  maxZoom: 1,
  name: 'Gall-Peters'
});

gallPetersMapType.projection = new GallPetersProjection();

app.controller('MapProjectionSimpleCtrl', function($scope, $window) {
  $scope.alertLocation = function(event) {
    $window.alert('Point.X.Y: ' + event.latLng);
  };
});
