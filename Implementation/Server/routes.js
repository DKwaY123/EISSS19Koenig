var express = require('express');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var http = require('http');
//////////////////////////////////////////
//Module werden hinzugefügt

var appRouter = function (app) {

    app.use(bodyParser.json());
    
    //Route handling
    ///////////////////////////////////
    
    app.get('/', function(req, res) {
        res.status(200).send('Welcome to our restful API');
    });
    //GET request auf den standard tree -> Rückgabe "Welcome to our restful api"
    
    //Neue Route wird hinzugefuegt
/*    
    app.route('/route')
        .post(function(req, res) {
            var param_route_user = req.param('user');
            var param_route_start_plz = req.param('start_plz');
            var param_route_start_strasse = req.param('start_strasse');
            var param_route_start_hausnummer = req.param('start_hausnummer');
            var param_route_destination_plz = req.param('destination_plz');
            var param_route_destination_strasse = req.param('destination_strasse');
            var param_route_destination_hausnummer = req.param('destination_hausnummer');
//Entgegenname der zu übermittelnden Varibalen
   
//Abfrage ob die die jeweiligen varibalen mit Inhalt gefüllt sind
            if(param_route_user != null && param_route_start_plz != null && param_route_start_strasse != null && param_route_start_hausnummer != null && param_route_destination_plz != null && param_route_destination_strasse != null && param_route_destination_hausnummer != null) {
                fs.readFile(__dirname+'/database/route.json', 'utf8', function readFileCallback(err, data) {
                    if (err)
                        throw err;
                    else {
                        var route_count = 1; //-> 1 statt 0, da dann nicht mehr plus 1 gerechnet werden muss für die neue id
                        var database = JSON.parse(data.toString());
                        for(var x in database.route) {
                            route_count += 1;
                        }
//Daten werden in einem object zusammengefügt um dann in die JSON Datei gespeichert zu werden
                        var obj = {
                            route: []
                        };
                        obj = JSON.parse(data); //now its an object
                        obj.route.push({
                            id: route_count,
                            user: param_route_user,
                            startplz: param_route_start_plz,
                            startstrasse: param_route_start_strasse,
                            starthausnummer: param_route_start_hausnummer,
                            destinationplz: param_route_destination_plz,
                            destinationstrasse: param_route_destination_strasse,
                            destinationhausnummer: param_route_destination_hausnummer}); //Add data
                        var json = JSON.stringify(obj); //convert it back to JSON
                        fs.writeFile(__dirname + "/database/route.json", json, function(err) { //write in json
                            if(err)
                                throw err;
                        });
                    }
                });
                console.log("Route created => user_id: " + param_route_user + 
                            " start: " + param_route_start_plz + param_route_start_strasse + param_route_start_hausnummer + 
                            " destination: " + param_route_destination_plz + param_route_destination_strasse + param_route_destination_hausnummer);
                res.status(201).send('Route succesfully created!');
            }
            else {
                console.log("Route denied => user_id: " + param_route_user + 
                            " start: " + param_route_start_plz + param_route_start_strasse + param_route_start_hausnummer + 
                            " destination: " + param_route_destination_plz + param_route_destination_strasse + param_route_destination_hausnummer);
                res.status(400).send('Wrong characters!');
            }
        });
*/    
//Rückgabe einer bestimmten Route
    app.route('/route/:id')
        .get(function(req, res) {
            var param_route_id = req.param('id');
        
            fs.readFile(__dirname+'/database/route.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                if(param_route_id != null && isNaN(param_route_id) == false) {
                    
                    if(param_route_id < 1 || param_route_id > database.route.length) {
                        res.status(404).send('Id not found!');
                    }
                    else {
                        var response = {id: database.route[param_route_id - 1].id};
                            
                        res.status(200).send(response);
                    }
                }
                else {
                    res.status(400).send('Wrong characters!');
                }
            });
    });

//Rückgabe eines bestimmten Parkplatzes
    app.route('/parkplatz/:parkplatz')
        .get(function(req, res) {
            var param_parkplatz_id = req.param('parkplatz');
        
            fs.readFile(__dirname+'/database/parkplatz.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                if(param_parkplatz_id != null && isNaN(param_parkplatz_id) == false) {
                    
                    if(param_parkplatz_id < 1 || param_parkplatz_id > database.parkplatz.length) {
                        res.status(404).send('Id not found!');
                    }
                    else {
                        var response = {parkplatz: database.parkplatz[param_parkplatz_id - 1].flaeche};
                            
                        res.status(200).send(response);
                    }
                }
                else {
                    res.status(400).send('Wrong characters!');
                }
            });
    });
    
//Rückgabe eines bestimmten Users
    app.route('/user/:id')
        .get(function(req, res) {
            var param_user_id = req.param('id');
        
            fs.readFile(__dirname+'/database/user.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                if(param_user_id != null && isNaN(param_user_id) == false) {
                    
                    if(param_user_id < 1 || param_user_id > database.user.length) {
                        res.status(404).send('Id not found!');
                    }
                    else {
                        var response = {vorname: database.user[param_user_id - 1].vorname};
                            
                        res.status(200).send(response);
                    }
                }
                else {
                    res.status(400).send('Wrong characters!');
                }
            });
    });
   
//Bestimmte Route wird gelöscht
    app.route('/route/:id')
        .delete(function(req, res) {
            var param_route_id = req.param('id');
        
            fs.readFile(__dirname+'/database/route.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());

                    if(param_route_id != null && isNaN(param_route_id) == false) {

                        if(param_route_id < 1 || param_route_id > database.route.length) {
                            res.status(404).send('Id not found!');
                        }
                        else {                
                            database.route[param_route_id - 1].user = "";
                            database.route[param_route_id - 1].startplz = "";
                            database.route[param_route_id - 1].startstrasse = "";
                            database.route[param_route_id - 1].starthausnummer = "";
                            database.route[param_route_id - 1].destinationplz = "";
                            database.route[param_route_id - 1].destinationstrasse = "";
                            database.route[param_route_id - 1].destinationhausnummer = "";
                            database.route[param_route_id - 1].ankunftszeit = "";
                            database.route[param_route_id - 1].anzplaetzefrei = "";
                            
                            fs.writeFile(__dirname+'/database/route.json', JSON.stringify(database), function (err) {
                              if (err) 
                                  return console.log(err);
                            });
                            
                            res.status(204).send();
                        }
                    }
                    else {
                        res.status(400).send('Wrong characters!');
                    }
            });
        });
    
//Bestimmter User wird gelöscht
    app.route('/user/:id')
        .delete(function(req, res) {
            var param_user_id = req.param('id');
        
            fs.readFile(__dirname+'/database/user.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());

                    if(param_user_id != null && isNaN(param_user_id) == false) {

                        if(param_user_id < 1 || param_user_id > database.user.length) {
                            res.status(404).send('Id not found!');
                        }
                        else {                
                            database.user[param_user_id - 1].vorname = "";
                            database.user[param_user_id - 1].nachname = "";
                            database.user[param_user_id - 1].strasse = "";
                            database.user[param_user_id - 1].hausnummer = "";
                            database.user[param_user_id - 1].plz= "";
                            
                            fs.writeFile(__dirname+'/database/user.json', JSON.stringify(database), function (err) {
                              if (err) 
                                  return console.log(err);
                            });
                            
                            res.status(204).send();
                        }
                    }
                    else {
                        res.status(400).send('Wrong characters!');
                    }
            });
        });
    
    //Alle Parkplätze plus gesammt Anzahl frei Plätze wird ausgegeben
    app.route('/parkplatz')
        .get(function(req, res) {

            fs.readFile(__dirname+'/database/parkplatz.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                var raw_data = [];

                for(var x in database.parkplatz) {
                    raw_data.push(database.parkplatz[x].flaeche);
                }
                
                raw_data.push(database.gesamt);

                res.status(200).send(raw_data);
            });
        });
    
//Alle Routen werden ausgegeben
    app.route('/route')
        .get(function(req, res) {

            fs.readFile(__dirname+'/database/route.json', function(err, data) {

                if(err)
                    throw err;
                else
                    console.log('-> database loaded!');

                var database = JSON.parse(data.toString());

                var raw_data = [];

                for(var x in database.route) {
                    raw_data.push('id: ' + database.route[x].id,
                                  'user: ' + database.route[x].user,
                                  'startplz: ' + database.route[x].startplz,
                                  'startstrasse: ' + database.route[x].startstrasse,
                                  'starthausnummer: ' + database.route[x].starthausnummer,
                                  'destinationplz: ' + database.route[x].destinationplz,
                                  'destinationstrasse: ' + database.route[x].destinationstrasse,
                                  'destinationhausnummer: ' + database.route[x].destinationhausnummer,
                                  'ankunftszeit: ' + database.route[x].ankunftszeit,
                                  'anzplaetzefrei: ' + database.route[x].anzplaetzefrei);
                }

                res.status(200).send(raw_data);
            });
        });
    
//Alle User werden ausgegeben
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
                                  database.user[x].vorname,
                                  database.user[x].nachname,
                                  database.user[x].strasse,
                                  database.user[x].hausnummer,
                                  database.user[x].plz);
                }

                res.status(200).send(raw_data);
            });
        });
    
//Neuen User hinuzfügen
    app.route('/user')
        .post(function(req, res) {
            var param_user_vorname = req.param('vorname');
            var param_user_nachname = req.param('nachname');
            var param_user_strasse = req.param('strasse');
            var param_user_hausnummer = req.param('hausnummer');
            var param_user_plz = req.param('plz');

            if(param_user_vorname != null && param_user_nachname != null && param_user_strasse != null && param_user_hausnummer != null && param_user_plz != null) {
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
                            vorname: param_user_vorname,
                            nachname: param_user_nachname,
                            strasse: param_user_strasse,
                            hausnummer: parseInt(param_user_hausnummer, 10),
                            plz: parseInt(param_user_plz, 10)}); //Add data
                        var json = JSON.stringify(obj); //convert it back to JSON
                        fs.writeFile(__dirname + "/database/user.json", json, function(err) { //write in json
                            if(err)
                                throw err;
                        });
                    }
                });

                res.status(201).send('User succesfully created!');
            }
            else {
               res.status(400).send('Wrong characters!');
            }
        });
    
//Neue Route hinzufügen
    app.route('/route')
        .post(function(req, res) {
            var param_route_user = req.param('user');
            var param_route_startplz = req.param('startplz');
            var param_route_startstrasse = req.param('startstrasse');
            var param_route_starthausnummer = req.param('starthausnummer');
            var param_route_destinationplz = req.param('destinationplz');
            var param_route_destinationstrasse = req.param('destinationstrasse');
            var param_route_destinationhausnummer = req.param('destinationhausnummer');
            var param_route_ankunftszeit = req.param('ankunftszeit');
            var param_route_anzplaetzefrei = req.param('anzplaetzefrei');
            

            if(param_route_user != null && param_route_startplz != null && param_route_startstrasse != null && param_route_starthausnummer != null && param_route_destinationplz != null && param_route_destinationstrasse != null && param_route_destinationhausnummer != null && param_route_ankunftszeit != null && param_route_anzplaetzefrei != null) {
                fs.readFile(__dirname+'/database/route.json', 'utf8', function readFileCallback(err, data) {
                    if (err)
                        throw err;
                    else {
                        var route_count = 1; //-> 1 statt 0, da dann nicht mehr plus 1 gerechnet werden muss für die neue id
                        var database = JSON.parse(data.toString());
                        for(var x in database.route) {
                            route_count += 1;
                        }

                        var obj = {
                            route: []
                        };
                        obj = JSON.parse(data); //now its an object
                        obj.route.push({
                            id: route_count,
                            user: parseInt(param_route_user, 10),
                            startplz: parseInt(param_route_startplz, 10),
                            startstrasse: param_route_startstrasse,
                            starthausnummer: param_route_starthausnummer,
                            destinationplz: parseInt(param_route_destinationplz, 10),
                            destinationstrasse: param_route_destinationstrasse,
                            destinationhausnummer: param_route_destinationhausnummer,
                            ankunftszeit: param_route_ankunftszeit,
                            anzplaetzefrei: parseInt(param_route_anzplaetzefrei, 10)}); //Add data
                        var json = JSON.stringify(obj); //convert it back to JSON
                        fs.writeFile(__dirname + "/database/route.json", json, function(err) { //write in json
                            if(err)
                                throw err;
                        });
                    }
                });

                res.status(201).send('Route succesfully created!');
            }
            else {
               res.status(400).send('Wrong characters!');
            }
        });
    
//User updaten
    app.route('/user/:id')
        .put(function(req, res) {
            var param_user_id = req.param('id');
            var param_user_vorname = req.param('vorname');
            var param_user_nachname = req.param('nachname');
            var param_user_strasse = req.param('strasse');
            var param_user_hausnummer = req.param('hausnummer');
            var param_user_plz = req.param('plz');
        
            fs.readFile(__dirname+'/database/user.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());

                    if(param_user_id != null && isNaN(param_user_id) == false) {

                        if(param_user_id < 1 || param_user_id > database.user.length) {
                            res.status(404).send('Id not found!');
                        }
                        else {
                            if(param_user_vorname != null) {
                                database.user[param_user_id - 1].vorname = param_user_vorname;
                            }
                            if(param_user_nachname != null) {
                                database.user[param_user_id - 1].nachname = param_user_nachname;
                            }
                            if(param_user_strasse != null) {
                                database.user[param_user_id - 1].strasse = param_user_strasse;
                            }
                            if(param_user_hausnummer != null) {
                                database.user[param_user_id - 1].hausnummer = param_user_hausnummer;
                            }
                            if(param_user_plz != null) {
                                database.user[param_user_id - 1].plz = parseInt(param_user_plz, 10);
                            }
                         
                            
                            fs.writeFile(__dirname+'/database/user.json', JSON.stringify(database), function (err) {
                              if (err) 
                                  return console.log(err);
                            });
                            
                            res.status(204).send();
                        }
                    }
                    else {
                        res.status(400).send('Wrong characters!');
                    }
            });
        });
    
    //Route updaten
    app.route('/route/:id')
        .put(function(req, res) {
            var param_route_id = req.param('id');
            var param_route_user = req.param('user');
            var param_route_startplz = req.param('startplz');
            var param_route_startstrasse = req.param('startstrasse');
            var param_route_starthausnummer = req.param('starthausnummer');
            var param_route_destinationplz = req.param('destinationplz');
            var param_route_destinationstrasse = req.param('destiantionstrasse');
            var param_route_destinationhausnummer = req.param('destinationhausnummer');
            var param_route_ankunftszeit = req.param('ankunftszeit');
            var param_route_anzplaetzefrei = req.param('anzplaetzefrei');
        
            fs.readFile(__dirname+'/database/route.json', function(err, data) {

                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());

                    if(param_route_id != null && isNaN(param_route_id) == false) {

                        if(param_route_id < 1 || param_route_id > database.route.length) {
                            res.status(404).send('Id not found!');
                        }
                        else {
                            if(param_route_user != null) {
                                database.route[param_route_id - 1].vorname = parseInt(param_route_user, 10);
                            }
                            if(param_route_startplz != null) {
                                database.route[param_route_id - 1].nachname = parseInt(param_route_startplz, 10);
                            }
                            if(param_route_startstrasse != null) {
                                database.route[param_route_id - 1].strasse = param_route_startstrasse;
                            }
                            if(param_route_starthausnummer != null) {
                                database.route[param_route_id - 1].hausnummer = param_route_starthausnummer;
                            }
                            if(param_route_destinationplz != null) {
                                database.route[param_route_id - 1].plz = parseInt(param_route_destinationplz, 10);
                            }
                            if(param_route_destinationstrasse != null) {
                                database.route[param_route_id - 1].plz = param_route_destinationstrasse;
                            }
                            if(param_route_destinationhausnummer != null) {
                                database.route[param_route_id - 1].plz = param_route_destinationhausnummer;
                            }
                            if(param_route_ankunftszeit != null) {
                                database.route[param_route_id - 1].plz = param_route_ankunftszeit;
                            }
                            if(param_route_anzplaetzefrei != null) {
                                database.route[param_route_id - 1].plz = parseInt(param_route_anzplaetzefrei, 10);
                            }
                         
                            
                            fs.writeFile(__dirname+'/database/route.json', JSON.stringify(database), function (err) {
                              if (err) 
                                  return console.log(err);
                            });
                            
                            res.status(204).send();
                        }
                    }
                    else {
                        res.status(400).send('Wrong characters!');
                    }
            });
        });
    
//Route updaten
    app.route('/ergebnis/:destinationplz/:destiantionstrasse/:destinationhausnummer/:ankunftszeit')
        .get(function(req, res) {
            var param_ergebnis_destinationplz = req.param('destinationplz');
            var param_ergebnis_destinationstrasse = req.param('destiantionstrasse');
            var param_ergebnis_destinationhausnummer = req.param('destinationhausnummer');
            var param_ergebnis_ankunftszeit = req.param('ankunftszeit');
        
            if(param_ergebnis_destinationplz != null && param_ergebnis_destinationstrasse != null && param_ergebnis_destinationhausnummer != null && param_ergebnis_ankunftszeit != null) {
                
                fs.readFile(__dirname+'/database/route.json', function(err, data) {
                    
                    if(err)
                        throw err;
                    else
                        console.log('-> database loaded!');

                    var database = JSON.parse(data.toString());
                    
                    var obj = { route: [] };
                    
                    var counter = false;
                    
                    for(var x in database.route) {
                        
                        if(database.route[x].destinationplz == param_ergebnis_destinationplz && database.route[x].destinationstrasse == param_ergebnis_destinationstrasse && database.route[x].destinationhausnummer == param_ergebnis_destinationhausnummer && database.route[x].ankunftszeit == param_ergebnis_ankunftszeit) {
                           
                        obj.route.push({
                            startplz: database.route[x].startplz,
                            startstrasse: database.route[x].startstrasse,
                            starthausnummer: database.route[x].starthausnummer,
                            destinationplz: database.route[x].destinationplz,
                            destinationstrasse: database.route[x].destinationstrasse,
                            destinationhausnummer: database.route[x].destinationhausnummer,
                            ankunftszeit: database.route[x].ankunftszeit,
                            anzplaetzefrei: database.route[x].anzplaetzefrei}); //Add data
                            
                            counter = true;
                        }
                        else {
                            
                        }
                    }
                    
                    if(counter == true) {
                        var ergebnis = JSON.stringify(obj); //convert it back to JSON
                            
                        console.log('Übereinstimmung gefunden!');
                        
                        res.status(200).send(ergebnis); 
                    }
                    else {
                        console.log('Keine Übereinstimmung gefunden!');
                        
                        res.status(200).send(ergebnis); 
                    }
                    
                    
                });
            }
            else {
                res.status(400).send('Wrong characters!');
            }
    });
}

module.exports = appRouter;