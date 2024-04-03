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

app.post("/felhasznaloklekerdez", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    //Ezek maradhatnak, majd lekéne ellenőrizni hogy tényleg egy admin kéri az adatokat, vagy nem! (ez vonatkozik az összes többi admin felületi lekérdezésre)
    console.log(req.body);
    connection.query("select f.nev as nev from felhasznalo f" , function(err, result,fields){
        if(!err){
            //console.log(result+"Ez a result!!");
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a lekérdezés során!'});
        }
    })
    connection.end();
});

app.post("/felhasznalotorol", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);
    console.log("delete from felhasznalo where nev = '"+kivalasztottfelhasznalonev+"'");
    connection.query("delete from felhasznalo where nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a lekérdezés során!'});
        }
    })
    connection.end();
});

app.post("/jelszovaltoztatas", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param.felhasznalo;
    const ujjelszohash = req.body.param.jelszo;
    console.log(req.body);
    connection.query("UPDATE felhasznalo f SET f.jelszo = '"+ujjelszohash+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a jelszó változtatás során!'});
        }
    })
    connection.end();
});

app.post("/adminnatetel", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);
    connection.query("UPDATE felhasznalo f SET f.jog = 'admin' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a jelszó változtatás során!'});
        }
    })
    connection.end();
});

app.post("/regisztracio", bodyParser.json(),async function(req,res){
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const email = req.body.email;
    console.log(req.body);
    ellenorzes(felh,hasheltJelszo,email).then((joE)=>{
        let egyezoDB = joE[0].db;
        console.log(egyezoDB+" ez a joeeeeeeeeeeeeeeeee");
        console.log(egyezoDB==0+" ez a joeee");
        if(egyezoDB!=0){
            console.log("Felhasználó nem felel meg!");
            res.send({"Error": 'Ilyen felhasználó ezzel az email címmel vagy felhasználó névvel már létezik!'});
        }
        else if(egyezoDB==0){
            var connection = getConnection();
            connection.connect();
            console.log("Felhasználó megfelel!");
            let temp = Date().split(' ');
            let honapok = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let datum = temp[3]+"-"+(parseInt(honapok.indexOf(temp[1]))+1)+"-"+temp[2];
            console.log(datum);
            connection.query("insert into felhasznalo values(NULL,'"+felh+"','"+email+"','"+hasheltJelszo+"','user','"+datum+"')", function(err,result,fields){
                if(!err){
                    console.log("Felhasználó regisztrálva!");
                    res.send({"Valasz":"Sikeres Regisztráció!"});
                }else{
                    console.log("Error: Felhasználó regisztrálása sikertelen!");
                    res.send({"Error": 'Hiba a regisztrálás során!'});
                }
            });
            connection.end();
        }
    });
});

app.post("/felhasznalonevELL", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);
    connection.query("select count(*) as db from felhasznalo f WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result[0].db);
            if(result[0].db == 0)
            {
                res.send({"Valasz":false})
            }
            else
            {
                res.send({"Valasz":true})
            }
        }else{
            res.send({"Error": 'Hiba a jelszó változtatás során!'});
        }
    })
    connection.end();
});

app.post("/emailELL", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);
    connection.query("select count(*) as db from felhasznalo f WHERE f.email = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result[0].db);
            if(result[0].db == 0)
            {
                res.send({"Valasz":false})
            }
            else
            {
                res.send({"Valasz":true})
            }
        }else{
            res.send({"Error": 'Hiba a jelszó változtatás során!'});
        }
    })
    connection.end();
});



function ellenorzes(felh,jelszo,email){
    return new Promise((resolve) => {
        var connection = getConnection();
        connection.connect();
        connection.query("select count(*) as db from felhasznalo f where (f.email = '"+email+"' or f.nev = '"+felh+"')", function(err, result,fields){
            if(!err){
                console.log(result[0].db+" ennyi darab egyező");
                connection.end;
                resolve(result);
            }else{
                connection.end;
                resolve(undefined);
            }
        });
        connection.end;
      });
}
app.listen(3000);
