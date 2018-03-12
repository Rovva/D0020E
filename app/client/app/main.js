
var map, heatmap;
var markers = [];
var positions = [];
var polygon;
var selectionType = 0;
var tmp;
var polygonExists = false;
var allMarkers = [];

var savedFilters = [];

var savedLogic = [];
var selectedLogic = "";

var zoomThreshold;
var visiblePoints;

//setup map using googleMaps api. Adds a drawing manager to the map and sets up various style options.
function initMap() {


    var centerPos = {lat: 65.581631, lng: 22.160044};


    zoomThreshold = 6;
    map = new google.maps.Map(document.getElementById('map'), {
        center: centerPos,
        zoom: zoomThreshold,
        mapTypeId: "satellite"
    });

    heatmap = new Heatmap(map);
    heatmap.initialize();

    visiblePoints = new VisiblePoints(map, null);
    visiblePoints.onGooglePoints = function() {
        heatmap.update(this.googlePoints);
    };

    var once = false;

    map.addListener("bounds_changed", function() {
        if(!once)
            visiblePoints.getVisiblePoints();
        once = true;
    });

    /*
    * Draw a circle, polygon or rectangle on google maps as a marker.
    */
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['circle', 'polygon', 'rectangle']
        },
        markerOptions: {
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        },
        circleOptions: {
            fillColor: '#000000',
            fillOpacity: .3,
            strokeWeight: 4,
            strokeColor: '#000000',
            clickable: false,
            draggable: true,
            editable: true,
            zIndex: 1
        },
        rectangleOptions: {
            fillColor: '#000000',
            fillOpacity: .3,
            strokeWeight: 4,
            strokeColor: '#000000',
            clickable: false,
            draggable: true,
            editable: true,
            zIndex: 1
        },
        polygonOptions: {
            fillColor: '#000000',
            fillOpacity: .3,
            strokeWeight: 4,
            strokeColor: '#000000',
            clickable: false,
            draggable: true,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);



    drawingManager.addListener('overlaycomplete', function (marker) {

        id = "F" + savedFilters.length.toString();
        marker.id = id;

        savedFilters.push({
            type: marker.type,
			dataType:"air_temperature",//default value of select...
            id: id,
            name: id,
            marker: marker
        });
        allMarkers.push(marker);
        loadFilters();
    });

}





/*
 * Clears all markers on the map.
 */
function clearFilters () {
  allMarkers.forEach (function(marker) {
      marker.overlay.setMap(null);
  });
  allMarkers = [];
  savedFilters = [];
  document.getElementById('filter-container').innerHTML = '';

}

function openModal(modalName) {
    var modal = document.getElementById(modalName);
    modal.style.display = "block";
}



function clearGraphs () {
    document.getElementById('graphs_container').innerHTML = '';
}

/* Delete a specific mark or filter. */
function deleteFilter(isFilter,i) {
    if(isFilter) {
        if(["circle","polygon","rectangle"].indexOf(savedFilters[i].type) != -1) {
            savedFilters[i].marker.overlay.setMap(null);
        }
        savedFilters.splice(i,1);
        loadFilters();
    } else {
        savedLogic.splice(i,1);
        loadFilters();
    }
}


/*
Takes the global var savedFilters and takes all the saved filters in it and sets different lon/lats depending on if the filter is a polygon, rectangle or circle.
Also seems to hard code data values such as snow, wet, ice, moist etc (?)
*/
function convertFilter (startTime,endTime) {
    var returnFilters = {filters:[]};

    savedFilters.forEach( function (filter) {
        var type = filter.type;
        switch (type) {
            case "polygon": {
                pointsToOutput = [];
                filter.marker.overlay.getPath().getArray().forEach(function(element,index) {
                    pointsToOutput.push({
                        lon: element.lng(),
                        lat: element.lat()
                    });
                });

                returnFilters.filters.push({
                    name: filter.name,
					date:{
						start:startTime,
						end: endTime					
					},
					dataType:filter.dataType,
		    polygon:{points: pointsToOutput}	
                    
                });
                break;
            }

            case "rectangle": {
                var bounds = filter.marker.overlay.getBounds();
                var ne = bounds.getNorthEast(); // LatLng of the north-east corner
                var sw = bounds.getSouthWest(); // LatLng of the south-west corder
                var nw = new google.maps.LatLng(ne.lat(), sw.lng());
                var se = new google.maps.LatLng(sw.lat(), ne.lng());

                returnFilters.filters.push({
                    name: filter.name,
			date:{
				start:startTime,
				end: endTime					
			},
			dataType:filter.dataType,
			polygon:{
		            points: [
		                {
		                    lon: nw.lng(),
		                    lat: nw.lat()
		                },

		                {
		                    lon: ne.lng(),
		                    lat: ne.lat()
		                },

		                {
		                    lon: se.lng(),
		                    lat: se.lat()
		                },

		                {
		                    lon: sw.lng(),
		                    lat: sw.lat()
		                }

		            ]
			}
                });



                break;
            }

            case "circle": {
                returnFilters.filters.push({
                    name: filter.name,
					date:{
						start:startTime,
						end: endTime					
					},
					dataType:filter.dataType,
		    circle:{
		            radius: filter.marker.overlay.radius,
		            point: {
		                lon: filter.marker.overlay.center.lng(),
		                lat: filter.marker.overlay.center.lat()
		            }
		    }
                });
                break;
            }

            default: {
                returnFilters.filters.push(filter);
            }
        }

    });
/*
    [["snow",6],["wet",3],["ice",5],["moist",2],["dry",1],["slush",4]].forEach(function(filterData) {
        returnFilters["swimds"].push({
            name: filterData[0],
            swimds: filterData[1]
        });
    });
*/

    if(document.getElementById(selectedLogic) == null) {
        var exportLogic = "";
    } else {
        if(document.getElementById(selectedLogic).value == "") { // Lägg tillbaka "text..." om placeholder ej fungerar.
            exportLogic = "";
        } else {
            var exportLogic = document.getElementById(selectedLogic).value;
        }
    }

    for(var key in returnFilters){
        if(returnFilters[key].length == 0) {
            delete returnFilters[key];
        }
    }


    return returnFilters;
}

function submit (graph) {
	var fromDate = document.getElementById("from_date").value;
	var fromTime = document.getElementById("from_time").value;
	var toDate = document.getElementById("to_date").value;
	var toTime = document.getElementById("to_time").value;

	var start = fromDate+"T"+fromTime+"Z";
	var end = toDate+"T"+toTime+"Z";

	
	var filters = convertFilter(start,end);
   	console.log(JSON.stringify(filters));

	
	var makeGraph = function (callback){
		var graphData = [];
		var counter = 0;
		for(var i = 0; i < filters.filters.length;i++){		//use callback after loop finished?
		
			var api = new Api();
			api.request("data",{"filters":filters.filters[i]},{
				onData: function(data) {
					console.log(JSON.stringify(data));
					graphData.push(data);
					counter++;
					if(counter == filters.filters.length){
						callback(graphData);
					}
			    
				}
			});
		}
		
		
	}

	var counter = 0;
	var cb = function(data){
		
		drawChart(graph,data);

	}
	makeGraph(cb);
	

}

/*
Updates logic choises, is used in loadFilters()
*/
function updateLogic () {
    savedLogic.forEach(function (logic) {
        var logicBox = document.getElementById(logic.id);
        if (logicBox != null) {
            logic.string = logicBox.value;
        }
    });
}

/*
Loads filters depending on the filter's type (if its a date, a polygon/circle/rectange, etc) and then uses updateLogic() to update the filters.
*/
function loadFilters () {


    var elementCounter = 0;
    document.getElementById('filter-container').innerHTML = '';
    savedFilters.forEach (function (filter) {
        var element = document.createElement("div");
        var icon = document.createElement("img");


        switch(true) {
            case (["polygon","circle","rectangle"].indexOf(filter.type) != -1): icon.src = "http://simpleicon.com/wp-content/uploads/map-marker-8.png"; break;
            case (["date"].indexOf(filter.type) != -1): icon.src = "../../assets/media/date.png"; break;
            case (["air_temperature"].indexOf(filter.type) != -1): icon.src = "../../assets/media/air_temp.png"; break;
            case (["road_temperature"].indexOf(filter.type) != -1): icon.src = "../../assets/media/road_temp.png"; break;
            case (["air_humidity"].indexOf(filter.type) != -1): icon.src = "../../assets/media/humidity.png"; break;
            case (["signal"].indexOf(filter.type) != -1): icon.src = "../../assets/media/signal.png"; break;
            case (["friction"].indexOf(filter.type) != -1): icon.src = "../../assets/media/signal.png"; break;
            default: icon.innerHTML = "??"; break;
        }


        //When someone clicks on a created filter.
        /* WORK IN PROGRESS, UPDATE FILTERS.
        element.onclick = function() {
           // console.log(this.id);
            openModal("update_filter_modal");
            viewSavedFilter(savedFilters[this.id]);
        }; */



        var closeButton = document.createElement("button");
        closeButton.value = elementCounter;
        closeButton.onclick = function() {
            deleteFilter(true,this.value);
        };


        element.appendChild(icon);
        element.appendChild(document.createTextNode(filter.name));
        element.appendChild(closeButton);
	element.appendChild(document.createElement("BR")); 
	var dropdown = document.createElement("select");
	var options = [
			{value:"air_temperature",text:"Air temp."},
			{value:"road_temperature",text:"Road temp."},
			{value:"air_humidity",text:"Air Humidity"}
	];

	for(var i = 0; i<options.length;i++){
		var option = document.createElement("option");
		option.value = options[i].value;
		option.text = options[i].text;
		dropdown.appendChild(option);	
	}
	

	dropdown.onchange = function(){
		var id = this.parentElement.id;
		savedFilters[id].dataType = this.value;
	};
	element.appendChild(dropdown);
	
        document.getElementById('filter-container').appendChild(element);

        element.id = elementCounter;    //this is the index in the list
        elementCounter++;
    });
}



function selectLogic(logicID) {
    if(selectedLogic == logicID) {
        selectedLogic = "";
        heatmap.replace([]);
    } else {
        selectedLogic = logicID;

        var theFilter = convertFilter();
        visiblePoints = new VisiblePoints(map, theFilter);

        visiblePoints.getVisiblePoints();
        visiblePoints.onGooglePoints = function() {
            heatmap.replace(this.googlePoints);
        };

        /*
        var api = new Api();
        var theFilter = convertFilter();
        api.request("points", theFilter, {
            onData: function(data) {
                console.log(data);
                heatmap.replace(data);
            }
        });
        */

    }
    loadFilters();
}

/*
Saves a filter as "F" and the lenght of the filter into another object that is then saved in another array. 
All the filters has 4 variables in the array so the lenght will probably always be 4 unless it is changed in any subtile place or way.
*/
function saveFilter(filterObj) {
    filterObj.name = "F" + savedFilters.length.toString();
    savedFilters.push(filterObj);
    loadFilters();
}


function toggleMenu (btn) {
    //$('submit1').height($('submit1').width());
    // Line below makes the three graphbuttons function
    var submitButton = document.getElementById('submit1');
    //console.log(JSON.stringify($('submit1').height()));
    //submitButton.style.width = submitButton.style.height.toString();
    $(btn).toggleClass("menu-button-open");
    $("#side-nav").toggleClass("side-nav-open");

}

function toggleGraphs (btn) {
    $(btn).toggleClass("graphs-button-open");
    $("#graphs_div").toggleClass("graphs-div-open");
}
