var express = require("express");
var bodyParser = require("body-parser");
//Here we are calling our installed modules and assigning them to variable express and bodyParser respectively

var routes = require("./routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//The two lines above tells express to accept both JSON and url encoded values

routes(app);

var server = app.listen(3333, function () {
    console.log("Dienstgeber running on port:", server.address().port);
})
//Here we defined the port where our server should be running on