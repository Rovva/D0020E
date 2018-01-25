var util = require("util");

var filter = require("./filters"),
	ensure = require("./ensure"),
	filter_expression = require("./expressions.js");


function Filter() {
	var _filters = {};
	var _types = {
		point: {
		  is: function(points) {
			return ensure(points, [
					{
						name: "",
						radius: 1,
						point: {
							lat: 1.1,
							lon: 1.1
						}
					}
				]);
		  },
		  parse: function(points) {
			for(var i = 0; i<points.length; i++) {
			  var point = points[i];
			  _filters[point.name] = {
				  geo_distance: {
					distance: util.format("%sm", point.radius),
					location: {
					  lat: point.point.lat,
					  lon: point.point.lon
					}
				 }
			  }
			}
		  }
		},

	
		date: {
		  is: function(dates) {
			  return ensure(dates, [
				  {
					  name: "", // kiss
					  start: "", // "2015-01-01T12:10:30Z"
					  end: "" // "2017-01-01T12:10:30Z"
				  }
			  ]);
		  },
		  parse: function(dates) {
			for(var i = 0; i<dates.length; i++) {
			  var date = dates[i];
			  _filters[date.name] = filter.MinMax("timestamp", date.start, date.end);
			}
		  }
		},
		polygon: {
		  is: function(polygons) {
			  return ensure(polygons, [
				  {
					  name: "",
					  points: [
						  {
							  lon: 1.1,
							  lat: 1.1
						  }
					  ]
				  }
			  ]);
		  },
		  parse: function(polygons) {
				for(var i = 0; i<polygons.length; i++) {
				  var polygon = polygons[i];
				  _filters[polygon.name] = {
					  geo_polygon: {
						location: {
						  points: polygon.points
						}
					  }
				  }
				}
		  }
		},
		signal: {
		  is: function(signals) {
			  return ensure(signals, [
				  {
					  name: "",
					  signal: 1,
					  min: 1,
					  max: 1
				  }
			  ]);
		  },
		  parse: function(signals) {
			for(var i = 0; i<signals.length; i++) {
			  var signal = signals[i];
			  var sig = util.format("s%s", ""+signal.signal);
			  var name = signal.name;
			  _filters[name] = filter.MinMax(sig, signal.min, signal.max);
			}
		  }
		},
		road_temperature: {
		  is: function(r_temp) {
			  return ensure(r_temp, [
				  {
					  name: "",
					  min: 1,
					  max: 1
				  }
			  ]);
		  },
		  parse: function(road_temperatures) {
			for(var i = 0; i<road_temperatures.length; i++) {
			  var temp = road_temperatures[i];
			  var min = temp.min;
			  var max = temp.max;

			  _filters[temp.name] = filter.MinMax("road_temperature", min, max);
			}
		  }
		},

		friction: {
		  is: function(fric) {
			  return ensure(fric, [
				  {
					  name: "",
					  min: 1,
					  max: 1
				  }
			  ]);
		  },
		  parse: function(frictions) {
			for (var i = 0; i < frictions.length; i++) {
			  var friction = frictions[i];
			  var min = friction.min;
			  var max = friction.max;

			  _filters[friction.name] = filter.MinMax("friction", min, max);
			}
		  }
		},

		air_temperature: {
		  is: function(air_temp) {
			  return ensure(air_temp, [
				  {
					  name: "",
					  min: 1,
					  max: 1
				  }
			  ]);
		  },
		  parse: function(air_temperatures) {
			for (var i = 0; i < air_temperatures.length; i++) {
			  var air_temperature = air_temperatures[i];
			  var min = air_temperature.min;
			  var max = air_temperature.max;

			  _filters[friction.name] = filter.MinMax("air_temperature", min, max);
			}
		  }
		},

		air_humidity: {
		  is: function(air_hum) {
			  return ensure(air_hum, [
				  {
					  name: "",
					  min: 1,
					  max: 1
				  }
			  ]);
		  },
		  parse: function(air_humidities) {
			for(var i = 0; i < air_humidites.length; i++) {
			  var air_humidity = air_humidities[i];
			  var min = air_humidity.min;
			  var max = air_humidity.max;

			  _filters[air_humidity.name] = filter.MinMax("air_humidity", min, max);
			}
		  }
		},
		swimds: {
		  is: function(swimds) {
			  return ensure(swimds, [
				  {
					  name: "",
					  swimds: 1
				  }
			  ]);
		  },
		  parse: function(swimdss) {
			  for(var i = 0; i<swimdss.length; i++) {
				  var swimds = swimdss[i];
				  _filters[swimds.name] = {
					  term: {
						  swimds: swimds.swimds
					  }
				  }
			  }
		  }
	   }
	};

	var _params = {};
	var _expression = "";

	this.QueryParams = function(params, expression) {
		_params = params;
		_expression = expression;
	};

	this.Parse = function() {
		for(var pkey in _params) {
		  var type = _types[pkey];
		  if(type != null) {
				if(type.is(_params[pkey])) {
				  type.parse(_params[pkey]);
				}
		  }
		}
	};

	this.ElasticsearchQuery = function() {
		return filter_expression(_expression.replace(/AND/g, "*").replace(/OR/g, "+").replace(/ /g, ""), _filters);
	}
}

exports.middleware = function(req, res, next) {
  if(req.body["filters"] != null && req.body["expression"] != null) {
    var filter = new Filter();
    filter.QueryParams(req.body.filters, req.body.expression);
    filter.Parse();
    req.filters = filter.ElasticsearchQuery();
		console.log(JSON.stringify(req.filters, null, 2));
		console.log(JSON.stringify(req.body.filters, null, 2));
		console.log(req.body.expression);
		console.log(req.originalUrl);
  }
  next();
}

exports.Filter = Filter;
