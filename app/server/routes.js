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

//data query
router.post("/data", function(req, res) {
	
	console.log(JSON.stringify(req.filters,undefined,2));
	var dataType = req.body.filters.dataType;
	var query = new Query(req.db.elasticsearch, req.filters);
	query.set(function(query) {
		query.body.aggregations = {
			air_temp : { terms : { field: dataType } ,
			
				aggs:{date:{terms:{ field: "timestamp" }}}
			}
			
		};
		return query;
	});

	query.query(function(resp, obj, err) {
		if(err == null){
			temp = resp.aggregations.air_temp;
			//console.log("unformated data:" + JSON.stringify(temp,undefined,2));
			var data = [];
			for(var i = 0; i < temp.buckets.length;i++){
				data.push({key:temp.buckets[i].key, date:temp.buckets[i].date.buckets[0].key_as_string});
			}

			data.sort(function(a,b){
				return new Date(a.date) - new Date(b.date);
			});
			obj.data = {name:req.body.filters.name,Data:data};
			

		



			console.log("data i routes:" + JSON.stringify(obj.data,undefined,2));		
		}
		res.json(obj);
	});
});

module.exports = router;
