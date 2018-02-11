var router = require("express").Router(),
	util = require("util"),
	db = require("./db/connection"),
	constants = require("./constants"),
	filter = require("./filter"),
	Query = require("./query").Query;

var success = function() {
	return constants.getSuccessObject();
};
var error = function() {
	return contants.getErrorObject();
}


// connect to database in beginning of each /api request.
router.use(db.middleware);

router.use(filter.middleware);

// capture GET /version
router.get("/version", function(req, res) {
	var version = success();
	version.data.version = "0.0.1337";
	version.data.name = "Data Name";
	res.json(version);
});

router.post("/version", function(req, res) {
  var version = error();
	version.data.version = "0.0.1337";
	version.data.name = "Data Name";
	res.json(version);
});

/*
 * Do a bucket geo_distance aggregation with some specific radius
 * and then aggregate with a metric
 */
router.post("/points", function(req, res) {
	var capSize = 60000 // MaxSize nu men ändras!
	var precision = 7 // ändras om definerat inom intervallet.
	if (Number.isInteger(req.body["size"])) {
		if (req.body["size"] < capSize) {
			capSize = req.body["size"]
		}
	}
	if (Number.isInteger(req.body["precision"])) {
		if (0 < req.body["precision"] && req.body["precision"] < 13) {
			precision = req.body["precision"]
		}
	}

	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(q) {
		q.body.aggregations = {
			grid: {
				geohash_grid: {
						field: "location",
						precision: precision,
						size: capSize
				},
				aggregations: {
					location_stats: {
						geo_centroid: {
							field: "location"
						}
					}
				}
			}
		};
		return q;
	});
	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.grid.buckets;

		res.json(obj);
	});
});



router.post("/signal", function(req, res) {
	var r;
	var signal = req.body.signal;
	var interval = req.body.interval;
	var min = 0;
	var max = 1000;
	if (req.body.min != null) {
		min = req.body.min;
	}
	if (req.body.max != null) {
		max = req.body.max;
	}

	var valid = false;
	if (signal != null && interval != null) {
		if (signal.match(/^[1-3]$/g) && interval.match(/^[0-9]{0,6}\.[0-9]+$/g)) {
			valid = true;
		}
	}
	if (!valid) {
		r = error();
		r.data.message = "Not valid signal or interval";
		res.json(r);
		return;
	}
	var ran = {range: {}};
	ran.range[util.format("s%s", signal)] = {
		from: min,
		to: max
	};

	var filters = {
		bool: {
			must: [
				ran,
				req.filters
			]
		}
	};

	var query = new Query(req.db.elasticsearch, filters);
	query.set(function(q) {
		q.body.aggregations = {
			signals : {
				histogram : {
					field: util.format("s%s", signal),
					interval: parseFloat(interval),
					extended_bounds: {
						min: min,
						max: max
					}
				}
			}
		};
		return q;
	});
	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.signals.buckets;

		res.json(obj);
	});
});

router.post("/swimds", function(req, res) {
	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			swimds_group : { terms : { field: "swimds" } }
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.swimds_group.buckets;

		res.json(obj);
	});
});

router.post("/air_temperature", function(req, res) {
	console.log("air_temperature körs");
	/*
	filters = {
		range:{
			timestamp:{
				gte:"2018-01-01T16:07:15Z",
				lte:"2018-02-01T16:07:28Z"
			}		
		}
	}
	*/
	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			air_temp : { terms : { field: "air_temperature" } ,
			
				aggs:{date:{terms:{ field: "timestamp" }}}
			}
			
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null){
			temp = resp.aggregations.air_temp;
			var data = [];
			for(var i = 0; i < temp.buckets.length;i++){
				data.push({key:temp.buckets[i].key, date:temp.buckets[i].date.buckets[0].key_as_string});
			}
			obj.data = data.sort(function(a,b){
				return new Date(b.date) - new Date(a.date);
			}); 


			console.log("data i routes:" + JSON.stringify(obj.data));		
		}
		res.json(obj);
	});
});

router.post("/road_temperature", function(req, res) {
	console.log("road_temperature körs");

	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			road_temp : { terms : { field: "road_temperature" } }
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.road_temp.buckets;

		res.json(obj);
	});
});

router.post("/air_humidity", function(req, res) {
	console.log("air humidity körs");

	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			air_hum : { terms : { field: "air_humidity" } }
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.air_hum.buckets;

		res.json(obj);
	});
});


router.post("/friction", function(req, res) {
	console.log("friction körs");

	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			fric : { terms : { field: "friction" } }
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null)
			obj.data = resp.aggregations.fric.buckets;

		res.json(obj);
	});
});


module.exports = router;
