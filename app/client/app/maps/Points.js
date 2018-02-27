//Class

/*
I believe this functionality handles the actual points themselves while heat_map.js selects the points.
*/

function VisiblePoints(map, filterObj) {
    this.googlePoints = [];
    this.pointsArray = [];
    this.onGooglePoints = null;


    var onPoints = function(points) {
      this.pointsArray = points;
      console.log(points);
      this.makeGooglePoints();
    }

    this.makeGooglePoints = function() {

        /* Makes google coordinates from pointsArray. */
        for (var i = 0; i < this.pointsArray.length; i++) {
          var point = this.pointsArray[i].location_stats.location;
          this.googlePoints.push({
            location: new google.maps.LatLng(point.lat, point.lon),
            weight: Math.log(this.pointsArray[i].doc_count)
          });
        }

        if(this.onGooglePoints != null)
          this.onGooglePoints();
    };

    this.onData = function(points) {
      this.pointsArray = points;
      this.makeGooglePoints();
    }

    this.getVisiblePoints = function () {
        /* Fetches all visible points on zoom. */
        var bounds = map.getBounds();
        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
        var sw = bounds.getSouthWest(); // LatLng of the south-west corder
        var nw = new google.maps.LatLng(ne.lat(), sw.lng());
        var se = new google.maps.LatLng(sw.lat(), ne.lng());


        if(filterObj == null) {
            this.pointsArray = [{
                    "polygon": [
                        {
                            "name": "sdad",
                            "points": [
                                {
                                    "lon": ne.lng,
                                    "lat": ne.lat
                                },
                                {
                                    "lon": nw.lng,
                                    "lat": nw.lat
                                },
                                {
                                    "lon": sw.lng,
                                    "lat": sw.lat
                                },
                                {
                                    "lon": se.lng,
                                    "lat": se.lat
                                }
                            ]
                        }
                    ]
            }];
        } else {
            this.pointsArray = filterObj;
        }
        var api = new Api();
        api.request("points", this.pointsArray, this);
    }
}
