var util = require("util");

var filter = require("./filters"),
	ensure = require("./ensure"),
	filter_expression = require("./expressions.js");


function Filter() {
	var _filters = {bool:{must:[]}};
	/*var _types = {
		point: {
		  parse: function(points) {
			for(var i = 0; i<points.length; i++) {
			  var point = points[i];
			  _filters.push({
				  geo_distance: {
					distance: util.format("%sm", point.radius),
					location: {
					  lat: point.point.lat,
					  lon: point.point.lon
					}
				 }
			  });
			}
		  }
		},
		date: {
		  parse: function(date) {
			console.log("date parsing", "date start", date.start);
			  _filters.push(filter.MinMax("timestamp", date.start, date.end));
		  }
		},
		polygon: {
		  parse: function(polygons) {
				for(var i = 0; i<polygons.length; i++) {
				  var polygon = polygons[i];
				  _filters.push({
					  geo_polygon: {
						location: {
						  points: polygon.points
						}
					  }
				  });
				}
		  }
		}
	};*/

	var _params = [];
	var _expression = "";

	this.QueryParams = function(params, expression) {
		_params = params;
		_expression = expression;
	};

	function parseData(type,value){
		switch(type){
		  	case "date":
				//_filters["range"] = {"timestamp":{"gte":value.start,"lte":value.end}};
			    	//_filters.filter.push(filter.MinMax("timestamp", value.start, value.end));
				_filters.bool.must.push({range:{"timestamp":{"gte":value.start,"lte":value.end}}});
			    	break;
			case "polygon":
				/*_filters["filters"] = {
					geo_polygon : {
						location:{
							points:value.points							
						}
					}
				};*/

				
				_filters.bool.must.push({
					geo_polygon : {
						location:{
							points:value.points							
						}
					}
				});		
						
				break;
			
  		}
	}

	this.Parse = function() {
		for (var type in _params) {
			parseData(type,_params[type]);
		} 
	};

	this.ElasticsearchQuery = function() {
		return _filters;
	}
}

exports.middleware = function(req, res, next) {
  if(req.body["filters"] != null) {
    var filter = new Filter();
    filter.QueryParams(req.body.filters, req.body.expression);
    filter.Parse();
    req.filters = filter.ElasticsearchQuery();
		console.log(JSON.stringify(req.filters, null, 2));
		console.log(JSON.stringify(req.body.filters, null, 2));
		console.log(req.originalUrl);
  }
  next();
}

exports.Filter = Filter;
