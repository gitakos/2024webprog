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
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a bejelentkezés során!'});
        }
    })
    connection.end();
});

app.post("/useradatlekerdez", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    console.log(req.body);
    connection.query("select f.nev as nev, f.email as email, f.jelszo as jelszo, f.jog as jog, f.letrehozas as letrehozas f. from felhasznalo f where f.nev = '"+felh+"' and f.jelszo = '"+hasheltJelszo+"'", function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a bejelentkezés során!'});
        }
    })
    connection.end();
});

app.post("/regisztracio", bodyParser.json(), function(req,res){
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const email = req.body.email;
    console.log(req.body);
    ellenorzes(felh,hasheltJelszo,email).then((joE)=>{
        console.log(joE+" ez a joeee");
        if(joE == false){
            console.log("Felhasználó nem felel meg!");
            res.send({"Error": 'Ilyen felhasználó ezzel az email címmel vagy felhasználó névvel már létezik!'});
        }
        else if(joE == true){
            var connection = getConnection();
            connection.connect();
            console.log("Felhasználó megfelel!");
            connection.query("insert into felhasznalo values(NULL,'"+felh+"','"+email+"','"+hasheltJelszo+"','user','2025-12-12')", function(err,result,fields){
                console.log("Belépek!");
                if(!err){
                    console.log("Belépek ide is HE!");
                    res.send(result);
                }else{
                    console.log("EROORRR");
                    res.send({"Error": 'Hiba a regisztrálás során!'});
                }
            });
            connection.end();
        }
    });
});

async function ellenorzes (felh,jelszo,email){
    var connection = getConnection();
    connection.connect();
    let valasz = null;
    connection.query("select count(*) as db from felhasznalo f where (f.email = '"+email+"' or f.nev = '"+felh+"') and f.jelszo = '"+jelszo+"'", function(err, result,fields){
        if(!err){
            console.log(result[0].db+" ennyi darab egyező");
            valasz = result;
        }else{
            valasz = undefined;
        }
    });
    connection.end;
    console.log(valasz+" ez-<<<<<");
    return valasz;
}
app.listen(3000);
