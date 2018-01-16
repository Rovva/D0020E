
/*
This file can most likely be removed, but must test before actually removing the file.
*/


var util = require("util"),
	ensure = require("./ensure");



// This can be tested
function Filter() {
  var _build_minmax = function(attribute, min, max) {
    var filter = { range: {} };
    filter.range[attribute] = {};
    if(min != null)
      filter.range[attribute].gte = min;
    if(max != null)
      filter.range[attribute].lte = max;

    return filter;
  }

  var _filter_types = {
    "SHOULD": 0,
    "MUST": 1,
    "MUST_NOT": 2
  };
  var filters = {};
  var _types = {
    point: {
      _is: function(points) {
		return ensure(points, [
			{ 
				name: "", 
				radius: 1, 
				point: { 
					lat: "", 
					lon: "" 
				} 
			}
		]);
      },
      _parse: function(points) {
        for(var i = 0; i<points.length; i++) {
          var point = points[i];
          filters[point.name] = {
            type: _filter_types.MUST,
            filter: {
              geo_distance: {
                distance: util.format("%sm", point.radius),
                location: {
                  lat: point.lat,
                  lon: point.lon
                }
              }
            }
          }
        }
      }
    },
    /*
    {
      name: "hej",
      start: ISO_FORMAT,
      end: ISO_FORMAT
    }
    */
    date: {
      _is: function(dates) {
		  return ensure(dates, [
			  {
				  name: "",
				  start: "",
				  end: ""
			  }
		  ]);
      },
      _parse: function(dates) {
        for(var i = 0; i<dates.length; i++) {
          var date = dates[i];
          filters[date.name] = {
            type: _filter_types.MUST,
            filter: _build_minmax("timestamp", date.start, date.end)
          }
        }
      }
    },
    /*
    {
      name: "hej"
      points: [
        { lon: 6.66, lat: 66.6 },
        ...
      ]
    }
    */
    polygon: {
      _is: function(polygons) {
		  return ensure(polygons, [
			  {
				  name: "",
				  points: [
					  {
						  lon: "",
						  lat: ""
					  }
				  ]
			  }
		  ]);
      },
      _parse: function(polygons) {
        for(var i = 0; i<polygons.length; i++) {
          var polygon = polygons[i];
          filters[polygon.name] = {
            type: _filter_types.MUST,
            filter: {
              geo_polygon: {
                location: {
                  points: polygon.points
                }
              }
            }
          }
        }
      }
    },
    /*
    {
      name: "hej",
      signal: 1,
      min: 10,
      max: 100
    }
    */
    signal: {
      _is: function(signals) {
		  return ensure(signals, [
			  {
				  name: "",
				  signal: 1,
				  min: 1,
				  max: 1
			  }
		  ]);
      },
      _parse: function(sinals) {
        for(var i = 0; i<signals.length; i++) {
          var signal = signals[i];
          var sig = util.format("s%s", ""+signal.signal);
          var name = signal.name;
          var min = signal.min;
          var max = signal.max;

          filters[name] = {
            type: _filter_types.MUST,
            filter: _build_minmax(sig, min, max)
          }
        }
      }
    },
    /*
    {
      name: "hej",
      min: 50,
      max: 100
    } */
    road_temperature: {
      _is: function(r_temp) {
		  return ensure(r_temp, [
			  {
				  name: "",
				  min: 1,
				  max: 1
			  }
		  ]);
      },
      _parse: function(road_temperatures) {
        for(var i = 0; i<road_temperatures.length; i++) {
          var temp = road_temperatures[i];
          var min = temp.min;
          var max = temp.max;

          filters[temp.name] = {
            type: _filter_types.MUST,
            filter: _build_minmax("road_temperature", min, max)
          }
        }
      }
    },

    friction: {
      _is: function(fric) {
		  return ensure(fric, [
			  {
				  name: "",
				  min: 1,
				  max: 1
			  }
		  ]);
      },
      _parse: function(frictions) {
        for (var i = 0; i < frictions.length; i++) {
          var friction = frictions[i];
          var min = friction.min;
          var max = friction.max;

          filters[friction.name] = {
            type: _filter_types.MUST,
            filter: _build_minmax("friction", min, max)
          }

        }
      }
    },

    air_temperature: {
      _is: function(air_temp) {
		  return ensure(air_temp, [
			  {
				  name: "",
				  min: 1,
				  max: 1
			  }
		  ]);
      },
      _parse: function(air_temperatures) {
        for (var i = 0; i < air_temperatures.length; i++) {
          var air_temperature = air_temperatures[i];
          var min = air_temperature.min;
          var max = air_temperature.max;

          filters[friction.name] = {
            type: _filter_types.MUST,
            filter: _build_minmax("air_temperature", min, max)
          }

        }
      }
    },

    air_humidity: {
      _is: function(air_hum) {
		  return ensure(air_hum, [
			  {
				  name: "",
				  min: 1,
				  max: 1
			  }
		  ]);
      },
      _parse: function(air_humidities) {
        for(var i = 0; i < air_humidites.length; i++) {
          var air_humidity = air_humidities[i];
          var min = air_humidity.min;
          var max = air_humidity.max;

          filters[air_humidity.name] = {
            type: _filter_types.MUST,
            filter: _build_minmax("air_humidity", min, max)
          }
        }
      }
    },
	swimds: {
		  _is: function(swimds) {
			  return ensure(swimds, [
				  {
					  name: "",
					  swimds: 1
				  }
			  ]);
		  },
		  _parse: function(swimdss) {
			  for(var i = 0; i<swimdss.length; i++) {
				  var swimds = swimdss[i];
				  filters[swimds.name] = {
					  type: _filter_types.MUST,
					  filter: {
						  term: {
							  swimds: swimds.swimds
						  }
					  }
				  }
			  }
		  }
	  }
  };

  var _params = {};
  var _conditions = "";

  this.QueryParams = function(params, cond) {
    _params = params;
    _conditions = cond;
  };

	// Parse all the query parameters
  this.Parse = function() {
    for(var pkey in _params) {
      var type = _types[pkey];
      if(type != null) {
        if(type._is(_params[pkey])) {
          type._parse(_params[pkey]);
        }
      }
    }
  };

  this._parseConditionString = function(s) {
    var must = [],
      should = [];

    var has_and = s.indexOf("*") != -1;
    var has_or = s.indexOf("+") != -1;

    if(has_and || has_or) {

    }

    var and_parts = s.split("*");
    and_parts.forEach(function(and_part) {
      if(and_part.indexOf("+") != -1) { // Has +
        var or_parts = and_part.split("+");
        or_parts.forEach(function(or_part) {
          should.push(or_part);
        });
      } else {
        // Is a AND value
        must.push(and_part);
      }
    });

    console.log("and",must);
    console.log("or",should);
  }

  this.ElasticsearchQuery = function() {
    var query = {
      bool: {
        should: [],
        must: [],
        must_not: [
          {
            match: { swimds: -999 }
          }
        ]
      }
    }; //2228921

    for(var name in filters) {
      var fil = filters[name];
      console.log(fil);
      switch(fil.type) {
        case _filter_types.SHOULD:
          query.bool.should.push(fil.filter);
          break;
        case _filter_types.MUST:
          query.bool.must.push(fil.filter);
          break;
        case _filter_types.MUST_NOT:
          query.bool.must_not.push(fil.filter);
          break;
        default:
          break;
      }
    }

    return query;
  };
}

exports.middleware = function(req, res, next) {
  if(req.body["filters"] != null) {
    var filter = new Filter();
    filter.QueryParams(req.body.filters, req.body.condition);
    filter.Parse();
    req.filters = filter.ElasticsearchQuery();
  }
  next();
}

exports.Filter = Filter;
