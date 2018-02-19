var con = require("./connection.js"),
	util = require("util");
	
//Creates indexes for elasticsearch 
function createMeasurementIndex(func) {
	
	con.elasticsearch.indices.create({
		index: "measurement",
		body: {
			mappings: {
				constituency: {
					properties: {
						timestamp: { type: "date" },
						location: { type: "geo_point" },
						swimds: { type: "integer" },
						s1: { type: "integer" },
						s2: { type: "integer" },
						s3: { type: "integer" },
						friction: { type: "float" },
						road_temperature: { type: "float" },
						air_temperature: { type: "float" },
						air_humidity: { type: "float" }, drive: { type: "integer" }		
					}
				}
			}
		}
	}, function(err, res, stat) {
		if(err) {
			console.log("ERR:",err);
			process.exit();
			
		}
		else {
			console.log("RES:",res);
			func();
		}
	});
}
function createIndex(ix) {
	con.elasticsearch.indices.create({
		index: ix
	}, function(err, res, status) {
		if(err)
			console.log("err:",err);
		else
			console.log("created:",res);	
	});
}
function deleteIndex(ix, func) {
	con.elasticsearch.indices.delete({
		index: ix 
	}, function(err, res, status) {
		if(err)
			console.log("err:",err)
		else
			console.log("deleted",res);	

		func();
	});
}

/*Push data from mysql to body, Column names are: 
surface_condition possible values are Snow, Wet, Ice, Moist and Slush (SWIMDS).
signal1 - signal 3
friction
road_temperature
air_temperature
air_humidity
*/

function pushData(start, end,func) {
	var count = 0;
	con.mysql.query(util.format("SELECT * FROM db.datareceiver_roadeyedata LIMIT %d,%d", start,end), function(err, res, f) {
		if(err){throw err}
		console.log(res);
		index = { 
			index: {
				_index: "measurement", 
				_type: "constituency" 
			}
		};
		var body = [];
		
		result = res.length;//uppdateras inte
		
		
		for(var i = 0; i<res.length; i++) {
			var r = res[i];
			body.push(index);
			body.push({
				timestamp: r.timestamp,
				location: {
				  lat: r.latitude,
				  lon: r.longitude
				},
				swimds: r.surface_condition,
				s1: r.signal1,
				s2: r.signal2,
				s3: r.signal3,
				friction: r.friction,
				road_temperature: r.road_temperature,
				air_temperature: r.air_temperature,
				air_humidity: r.air_humidity,
				drive: 0		//not sure what this is used for...
			});
		}

			
		con.elasticsearch.bulk({
			body: body	
		}, function(err, result, stat) {
			func(res);
		});
		
		console.log("*****************************");
		console.log("start:",start,"end:",end,"res.length: ",res.length);

		
	});
	
	console.log("count i push:", count);
	return count;
}

async function pollForNewEntries(waitTime){
	var count = 0;
	while(true){
		//push all data from 0 -- end
		console.log("count: ",count);
		pushData(count,100000, function(res) {
			count += res.length;
			
		});
		await sleep(waitTime);
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

createMeasurementIndex(function() {
	pollForNewEntries(30000);
});

