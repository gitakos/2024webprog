const express = require('express');
const app = express();

const cors = require("cors");
const bodyParser = require('body-parser');
var mysql = require('mysql');
const { response } = require('express');

app.use(cors());

var getConnection = ()=>{
    return mysql.createConnection({
        host     : "localhost",
        user     : "root",
        password : "",
        database : "angol"
    })
};

app.get('/', function(req, res){
    const connection = getConnection();
    let joe = true;
    connection.connect((err)=>{
        if(err) {
            res.send({"Error": "Nem jött létre a kapcsolat az adatbázissal."});
            joe = false;
        }
    });
    if(joe) {
        connection.query('show tables', function (error, results, fields) {
            res.send(results);
        });              
    }
    connection.end();        
});

app.post("/lekerdezes", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const lekerdezes = req.body.lekerdezes;

    connection.query(lekerdezes, function(err, result,fields){
        if(!err){
            res.send(result);
        }else{
            res.send({"Error": 'A lekérdezés nem hozott eredményt!'});
        }
    })
    connection.end();
});

app.post("/bejelentkezes", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    console.log(req.body);
    connection.query("select count(*) as db from felhasznalo f where f.nev = '"+felh+"' and f.jelszo = '"+hasheltJelszo+"'", function(err, result,fields){
        if(!err){
            console.log(result);
            console.log(result[0].db);
            if(result[0].db == 1){
                res.send("Sikeres bejelentkezés!");
            }
            else
            {
                res.send("Rossz felhasználó név vagy jelszó!");
            }
        }else{
            res.send({"Error": 'Hiba a bejelentkezés során!'});
        }
    })
    connection.end();
});

app.listen(3000);
