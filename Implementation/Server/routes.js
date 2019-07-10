var appRouter = function (app) {
    var express = require('express');
    var request = require('request');
    var fs = require('fs');
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    //faye server
    var http = require('http'),
    faye = require('faye');

    var app = express();
    var server = http.createServer(app),

    fayeServer = new faye.NodeAdapter({mount: '/faye', timeout: 45});
    fayeServer.attach(server);

    //connect to server
    var client = new faye.Client('http://localhost:3000' + "/faye");
    //client subscribe to server
    client.subscribe('/messages', function(message) {
      console.log('Got a message: ' + message.text);
    });
    //faye end
    app.get('/', function(req, res) {
        res.status(200).send('Welcome to our restful API');
    });
    //The above code tells our server that anytime there is a GET request to the root of our application it should print Welcome to our restful API
    app.route('/user')
        .get(function(req, res) {

            fs.readFile(__dirname+'/database/user.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                var raw_data = [];

                for(var x in database.user) {
                    raw_data.push(database.user[x].id,
                                  database.user[x].username,
                                  database.user[x].firstname,
                                  database.user[x].lastname,
                                  database.user[x].email);
                }

                res.status(200).send(raw_data);
            });
        })
        .post(function(req, res) {
            var param_user_username = req.param('username');
            var param_user_firstname = req.param('firstname');
            var param_user_lastname = req.param('lastname');
            var param_user_email = req.param('email');

            if(param_user_username != null && param_user_firstname != null && param_user_lastname != null && param_user_email != null) {
                fs.readFile(__dirname+'/database/user.json', 'utf8', function readFileCallback(err, data) {
                    if (err)
                        throw err;
                    else {
                        var user_count = 1; //-> 1 statt 0, da dann nicht mehr plus 1 gerechnet werden muss für die neue id
                        var database = JSON.parse(data.toString());
                        for(var x in database.user) {
                            user_count += 1;
                        }

                        var obj = {
                            user: []
                        };
                        obj = JSON.parse(data); //now its an object
                        obj.user.push({
                            id: user_count,
                            username: param_user_username,
                            firstname: param_user_firstname,
                            lastname: param_user_lastname,
                            email: param_user_email}); //Add data
                        var json = JSON.stringify(obj); //convert it back to JSON
                        fs.writeFile(__dirname + "/database/user.json", json, function(err) { //write in json
                            if(err)
                                throw err;
                        });
                        // publish client to client
                        client.publish('/messages', { text: 'Ein neuer User wurde hinzugefügt.'})
                              .then(function(){
                                console.log('Message recieved by server!');
                                },
                                function(error){
                                    console.log('Error beim publish bei app.post des /user im Dienstnutzer.');
                                            });
                    }
                });

                res.status(201).send('User succesfully created!');
            }
            else {
               res.status(400).send('Wrong characters!');
            }
        });

    app.route('/user/:id')
        .put(function(req, res) {
            /*var param_user_id = req.body.id;

        console.log(param_user_id);

        res.status(200).send('Wrong characters!');*/
        })
        .get(function(req, res) {
            var param_user_id = req.param('id');

            fs.readFile(__dirname+'/database/user.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());

                    if(param_user_id != null && isNaN(param_user_id) == false) {
                        var json_id = param_user_id - 1;
                        var json_id_high = 0;

                        database.user.forEach(function(element) {
                            json_id_high += 1;
                        });

                        if(param_user_id < 1 || param_user_id > json_id_high) {
                            res.status(404).send('Id not found!');
                        }
                        else {
                            res.status(200).send('username: ' + database.user[json_id].username);
                        }
                    }
                    else {
                        res.status(400).send('Wrong characters!');
                    }
            });
        });

    app.route('/veranstalter')
        .get(function(req, res) {

            var param_veranstalter_id = req.param('id');

            fs.readFile(__dirname+'/database/veranstalter.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                if(param_veranstalter_id == null) {
                    var raw_data = [];

                    for(var x in database.veranstalter) {
                        raw_data.push(database.veranstalter[x].id,
                                      database.veranstalter[x].organisation,
                                      database.veranstalter[x].lastname,
                                      database.veranstalter[x].firstname,
                                      database.veranstalter[x].email);
                    }
                    res.status(200).send(raw_data);
                }
                else if(param_veranstalter_id != null && isNaN(param_veranstalter_id) == false) {
                    var json_id = param_veranstalter_id - 1;
                    var json_id_high = 0;

                    database.veranstalter.forEach(function(element) {
                        json_id_high += 1;
                    });

                    if(param_veranstalter_id < 1 || param_veranstalter_id > json_id_high) {
                       res.status(404).send('Id not found!');
                    }
                    else {
                       res.status(200).send('organisation: ' + database.veranstalter[json_id].organisation);
                    }
                }
                else {
                    res.status(400).send('Wrong characters!');
                }
            });
        })
        .post(function(req, res) {
            var param_veranstalter_organisation = req.param('organisation');
            var param_veranstalter_lastname = req.param('lastname');
            var param_veranstalter_firstname = req.param('firstname');
            var param_veranstalter_email = req.param('email');

            if(param_veranstalter_organisation != null && param_veranstalter_lastname != null && param_veranstalter_firstname != null && param_veranstalter_email != null) {
                fs.readFile(__dirname+'/database/veranstalter.json', 'utf8', function readFileCallback(err, data) {
                    if (err)
                        throw err;
                    else {
                        var veranstalter_count = 1; //-> 1 statt 0, da dann nicht mehr plus 1 gerechnet werden muss für die neue id
                        var database = JSON.parse(data.toString());
                        for(var x in database.veranstalter) {
                            veranstalter_count += 1;
                        }

                        var obj = {
                            veranstalter: []
                        };
                        obj = JSON.parse(data); //now its an object
                        obj.veranstalter.push({
                            id: veranstalter_count,
                            name: param_veranstalter_organisation,
                            genre: param_veranstalter_lastname,
                            datum: param_veranstalter_firstname,
                            dauer: param_veranstalter_email}); //Add data
                        var json = JSON.stringify(obj); //convert it back to JSON
                        fs.writeFile(__dirname + "/database/veranstalter.json", json, function(err) { //write in json
                            if(err)
                                throw err;
                        });
                    }
                });

                res.status(201).send('Veranstalter succesfully created!');
            }
            else {
               res.status(400).send('Wrong characters!');
            }
        });

    app.route('/veranstalter/:id')
        .put(function(req, res) {
            res.status(200).send('Update a veranstalter!');
        })
        .get(function(req, res) {
            var param_veranstalter_id = req.param('id');

            fs.readFile(__dirname+'/database/veranstalter.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());
        });

    app.route('/bewertung')
        .get(function(req, res) {
            res.status(200).send('Get a bewertung!');
        })
        .post(function(req, res) {
            res.status(201).send('Add a bewertung!');
        })
        .put(function(req, res) {
            res.status(200).send('Update a bewertung!');
        });

    app.route('/veranstaltungsort/:id')
        .put(function(req, res) {
            res.status(200).send('Update a veranstaltungsort!');
        })
        .get(function(req, res) {
            var param_veranstaltungsort_id = req.param('id');

        });
    app.route('/area')
        .get(function(req, res) {
            res.status(200).send('test');
        });
        // Server is Listening on Port 8081
        server.listen(8081, function() {
          console.log("");
        });
    app.route('/bewertung'){
      
    }

}


module.exports = appRouter;
