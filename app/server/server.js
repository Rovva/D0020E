var util = require("util"),
	path = require("path");

var express = require("express"),
	bodyParser = require("body-parser"),
	app = express(),
	router = require("./routes");


// set some express variables
app.set("port", process.env.PORT | 80);
app.set("address", process.env.ADDRESS || "127.0.0.1");

// Index and stuff
app.use("/", express.static(path.join(__dirname, "../client")));

// so we can use all the data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// prefix with /api on every router request
app.use("/api", router);

// listen on specific port and address
app.listen(app.get("port"), app.get("listen_address"), function() {
	console.log(util.format("server started on %s:%s",
		app.get("address"),
		app.get("port")));
});
