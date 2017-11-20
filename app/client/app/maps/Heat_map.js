//CLASS
function Heatmap(map) {
    this.heatMap = null;
    this.points = [];
   // var map = map;
    var zoomThreshold = 12;

    var zoomUpdate = function() {
        var checkBox = document.getElementById("checkBoxHeatMap");

        if (map.zoom < zoomThreshold) {
            this.heatMap.setMap(null);
        }
        else {
            this.heatMap.setMap(map);

            if (checkBox.checked && map.zoom >= zoomThreshold) {
                console.log("utzoomat");
            }

        }
    }

    this.initialize = function() {
        this.create();
        //map.addListener("zoom_changed", zoomUpdate);
    }

    this.create = function() {
      this.heatMap = new google.maps.visualization.HeatmapLayer({
        data: this.points,
        map: map
      });
    }

    this.toggle = function() {
        /* This function will show or hide the heat map. */
        this.heatMap.setMap(this.heatMap.getMap() ? null : map);
    }

    this.replace = function(points) {
        this.heatMap.setMap(null);
        if(points.length != 0) {
            this.update(points);
        }
    };

    this.update = function(points) {
      this.points = points;
      this.create();
    }
}
