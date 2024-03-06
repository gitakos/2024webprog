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

app.post("/regisztracio", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const email = req.body.email;
    console.log(req.body);
    if(!ellenorzes(felh,hasheltJelszo,email,connection)){
        res.send({"Error": 'Ilyen felhasználó ezzel az email címmel vagy felhasználó névvel már létezik!'})
    }
    else{
        connection.query("insert into felhasznalo values(NULL,'"+felh+"','"+hasheltJelszo+"',0,'"+email+"')", function(err,res,fields){
            if(!err){
                res.send(result);
            }else{
                res.send({"Error": 'Hiba a regisztrálás során!'});
            }
        })
    }
    connection.end();
});

function ellenorzes(felh,jelszo,email,connection){
    connection.query("select count(*) as db from felhasznalo f where f.nev = '"+felh+"' and f.jelszo = '"+jelszo+"' and f.email = '"+email+"'", function(err, result,fields){
        if(!err){
            if(result[0].db>0){
                return false;
            }
            else{
                return true;
            }
        }else{
            return false;
        }
    })
}
app.listen(3000);
