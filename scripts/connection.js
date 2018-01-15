var elasticsearch = require("elasticsearch"),
	mysql = require("mysql"),
	util = require("util");

	
//Establish connection with MySQL database
var s_conn = mysql.createConnection({
	host: "rcm-mysql",
	user: "user",
	password: "pass",
	database: "db"
}); s_conn.connect();

//Establish connection with Elasticsearch 
var e_conn = new elasticsearch.Client({
	host: util.format("%s:9200", process.env.ELASTICSEARCH || "127.0.0.1"),
	log: [
		{
			type: "stdio",
			level: "error"
		}
	]
});

exports.mysql = s_conn;
exports.elasticsearch = e_conn;
exports.close = function() {
	s_conn.end();
	e_conn.close();
}

