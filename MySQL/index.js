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

/*app.get('/', function(req, res){
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
});*/

/*app.post("/lekerdezes", bodyParser.json(), function(req,res){
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
});*/

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
    connection.query("select f.nev as nev, f.email as email, f.jelszo as jelszo, f.jog as jog, f.letrehozas as letrehozas, f.megnev as megnev, f.zarolt as zarolt from felhasznalo f where f.nev = '"+felh+"' and f.jelszo = '"+hasheltJelszo+"'", function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a felhasználó adatai lekérdezése során!'});
        }
    })
    connection.end();
});

app.post("/jogZaroltLekerdezes", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const username = req.body.param.nev;
    console.log(req.body);
    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai.length>0)
        {
            if(lekerdezoAdatai[0].jog=="admin"){
                connection.query("select f.jog as jog, f.zarolt as zarolt from felhasznalo f where f.nev = '"+username+"'" , function(err, result,fields){
                    if(!err){
                        //console.log(result+"Ez a result!!");
                        res.send(result);
                    }else{
                        res.send({"Error": 'Hiba a lekérdezés során!'});
                    }
                });
            }
            else{
                res.send({"Error": 'Nincs jogosultságod ehhez a művelethez!'});
            }
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/felhasznaloklekerdez", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const adminnev = req.body.param.adminnev;
    //Ezek maradhatnak, majd lekéne ellenőrizni hogy tényleg egy admin kéri az adatokat, vagy nem! (ez vonatkozik az összes többi admin felületi lekérdezésre)
    console.log(req.body);
    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai.length>0)
        {
            if(lekerdezoAdatai[0].jog=="admin"){
                connection.query("select f.nev as nev from felhasznalo f where f.nev <> '"+adminnev+"'" , function(err, result,fields){
                    if(!err){
                        //console.log(result+"Ez a result!!");
                        res.send(result);
                    }else{
                        res.send({"Error": 'Hiba a lekérdezés során!'});
                    }
                });
            }
            else{
                res.send({"Error": 'Nincs jogosultságod ehhez a művelethez!'});
            }
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/felhasznalotorol", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);

    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            if(lekerdezoAdatai[0].jog=="admin"){
                connection.query("delete from felhasznalo where nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
                    if(!err){
                        console.log(result);
                        res.send(result);
                    }else{
                        console.log(err);
                        res.send({"Error": "Hiba a törlés során"});
                    }
                });
            }
            else{
                res.send({"Error": 'Nincs jogosultságod ehhez a művelethez!'});
            }
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/jelszovaltoztatas", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param.felhasznalo;
    const ujjelszohash = req.body.param.jelszo;
    console.log(req.body);

    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            if(lekerdezoAdatai[0].jog=="admin"){
                connection.query("UPDATE felhasznalo f SET f.jelszo = '"+ujjelszohash+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
                    if(!err){
                        console.log(result);
                        res.send(result);
                    }else{
                        res.send({"Error": 'Hiba a jelszó változtatása során!'});
                    }
                });
            }
            else{
                res.send({"Error": 'Nincs jogosultságod ehhez a művelethez!'});
            }
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/userjelszovalt", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const ujjelszohash = req.body.param.jelszo;
    console.log(req.body);

    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            connection.query("UPDATE felhasznalo f SET f.jelszo = '"+ujjelszohash+"' WHERE f.nev = '"+felh+"'" , function(err, result,fields){
                if(!err){
                    console.log(result);
                    res.send(result);
                }else{
                    res.send({"Error": 'Hiba a jelszó változtatása során!'});
                }
            });
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/emailvaltoztatas", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const kivalasztottfelhasznalonev = req.body.param.kivalasztottFelh;
    const ujemail = req.body.param.ujemail;
    console.log(req.body);
    connection.query("UPDATE felhasznalo f SET f.email = '"+ujemail+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a jelszó változtatás során!'});
        }
    })
    connection.end();
});

app.post("/useremailvalt", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const ujemail = req.body.param.email;
    console.log(req.body);

    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            connection.query("UPDATE felhasznalo f SET f.email = '"+ujemail+"' WHERE f.nev = '"+felh+"'" , function(err, result,fields){
                if(!err){
                    console.log(result);
                    res.send(result);
                }else{
                    res.send({"Error": 'Hiba a jelszó változtatása során!'});
                }
            });
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.post("/fnnevvaltoztatas", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const kivalasztottfelhasznalonev = req.body.param.kivalasztottFelh;
    const ujfnev = req.body.param.ujnev;
    console.log(req.body);
    connection.query("UPDATE felhasznalo f SET f.email = '"+ujfnev+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
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

    felhasznaloAdatLekerdez(kivalasztottfelhasznalonev).then((adatok)=>{
        if(adatok.length<0){
            res.send({"Error":"Nem létezik ez a felhasználó!"});
            return;
        }
        let eredetiJog = adatok[0].jog
        let jog = "user";
        if(eredetiJog=="user"){
            jog = "admin"
        }
        connection.query("UPDATE felhasznalo f SET f.jog = '"+jog+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
            if(!err){
                console.log(result);
                res.send({"Valasz":"A felhasználó "+jog+" jogosultságot kapott!"});
            }else{
                res.send({"Error": 'Hiba az adminná tétel változtatás során!'});
            }
        })
        connection.end();
    });
});

app.post("/felhasznalozarolas", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const kivalasztottfelhasznalonev = req.body.param;
    console.log(req.body);

    felhasznaloAdatLekerdez(kivalasztottfelhasznalonev).then((adatok)=>{
        if(adatok.length<0){
            res.send({"Error":"Nem létezik ez a felhasználó!"});
            return;
        }
        let ezarolt = adatok[0].zarolt;
        let zarolas = 1;
        if(ezarolt){
            zarolas = 0;
        }
        connection.query("UPDATE felhasznalo f SET f.zarolt = '"+zarolas+"' WHERE f.nev = '"+kivalasztottfelhasznalonev+"'" , function(err, result,fields){
            if(!err){
                console.log(result);
                res.send({"Valasz":"A felhasználó "+(zarolas==0 ? "imét elérhető" : "zárolva")+" lett!"});
            }else{
                res.send({"Error": 'Hiba a zárolás változtatás során!'});
            }
        })
        connection.end();
    });
});

app.post("/valaszlekerd_id", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const id = req.body.param;
    console.log(req.body);
    connection.query("select f.valaszok from feladatsor f where f.id = "+id, function(err, result,fields){
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.send({"Error": 'Hiba válaszok lekérdezése során!'});
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
            connection.query("insert into felhasznalo values(NULL,'"+felh+"','"+email+"','"+hasheltJelszo+"','user','"+datum+"','"+felh+"',0)", function(err,result,fields){
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

app.post("/feladatsorListaLekerdez", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const megoldashozE = req.body.param.megoldas;
    const feladatsorid = req.body.param.feladatsorid;
    let sqlquery = "";
    console.log(req.body);
    if(!megoldashozE){
        sqlquery = "select f.* from feladatsor f";
    }else{
        sqlquery = "select f.* from feladatsor f where f.id = "+feladatsorid+"";
    }
    connection.query(sqlquery, function(err, result,fields){
        if(!err){ 
            res.send(result);
        }else{
            res.send({"Error": 'Hiba a feladatsor lekérdezése során!'});
        }
    })
    connection.end();
});

app.post("/megnev", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const mitakarcsinalni = req.body.param.hova;
    const ujmegnev = req.body.param.ujmegnev;
    console.log(req.body);
    if(mitakarcsinalni == "megnevValt"){
        connection.query("update felhasznalo set megnev = '"+ujmegnev+"'  where nev = '"+felh+"'", function(err, result,fields){
            if(!err){ 
                res.send(result);
            }else{
                res.send({"Error": 'Hiba a megjelenített név frissítése során!'});
            }
        });
    }
    else if(mitakarcsinalni == "megnevLekerd"){
        connection.query("select f.megnev as megnev from felhasznalo f where f.nev = "+felh, function(err, result,fields){
            if(!err){ 
                res.send(result);
            }else{
                res.send({"Error": 'Hiba a megjelenített név lekérdezése során!'});
            }
        });
    }
    connection.end();
});

function felhasznaloValidator(felh,hasheltJelszo){
    //megnézi hogy van e ilyen és utánna vissza küldi a felhasznűló adatait

    let command = "select f.id as id, f.nev as nev, f.email as email, f.jog as jog from felhasznalo f where f.nev = '"+felh+"' and f.jelszo = '"+hasheltJelszo+"'"

    return new Promise((resolve) => {
        var connection = getConnection();
        connection.connect();
        connection.query(command, function(err, result,fields){
            console.log(result+"!!!!!!!!!!!!!!!!");
            if(!err){
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

app.post("/eredmenyeklekerd", bodyParser.json(), function(req,res){
    const jelszo = req.body.hasheltJelszo;
    const felh = req.body.felh;
    felhasznaloValidator(felh,jelszo).then((fid)=>{
        var connection = getConnection();
        connection.connect();
        connection.query("select e.id,e.felhasznaloid,e.pontszam,e.datum,e.feladatsorid,e.megadott_valaszok,f.szint as szint from eredmenyek e,feladatsor f where e.felhasznaloid = '"+fid[0].id+"' and f.id = e.feladatsorid order by e.datum desc;", function(err, result,fields){
            if(!err){
                console.log(result);
                res.send(result);
            }else{
                console.log(err);
                res.send({"Error": 'Hiba eredmenyek lekérdezése során!'});
            }
        })
        connection.end();
    });     
});

function felhasznaloAdatLekerdez(felh){

    let command = "select f.id as id, f.nev as nev, f.email as email, f.jog as jog, f.megnev as megnev, f.zarolt as zarolt from felhasznalo f where f.nev = '"+felh+"'"

    return new Promise((resolve) => {
        var connection = getConnection();
        connection.connect();
        connection.query(command, function(err, result,fields){
            console.log(result+"!!!!!!!!!!!!!!!!");
            if(!err){
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

app.post("/feladatLeadas", bodyParser.json(), function(req,res){
    /*var connection = getConnection();
    connection.connect();*/
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const userValaszok = req.body.param.valaszok
    const feladatID = req.body.param.feladatID
    console.log(req.body);
    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            feladatValaszLekerd(feladatID).then((feladatValaszok)=>{
                if(feladatValaszok.Error){
                    res.send({"Error":"Hiba a feladat válaszok lekérése közben!"});
                }
                else
                {
                    console.log(feladatValaszok);
                    let feladatValaszokLista = feladatValaszok[0].valaszok.split(';');
                    let pontok = feladatKijav(userValaszok,feladatValaszok[0].valaszok.split(';'));
                    valaszLement(lekerdezoAdatai[0].id,pontok,feladatID,userValaszok.join(";")).then((valasz)=>{
                        if(valasz==undefined){
                            console.log("Ez fut le")
                            res.send({"Error":"Hiba a válaszok lementése közben!"});
                        }
                        else
                        {
                            console.log("cucc");
                            res.send({"Valasz":"kijavított feladat","pontok":pontok,"maxpont":feladatValaszokLista.length, jovalaszok:feladatValaszok[0].valaszok});
                        }
                    });
                }
            })
        }
        else
        {
            res.send({"Error":"Nem megfelelő adatok!"});
        }
    });
});

function feladatValaszLekerd(feladatID){
    return new Promise((resolve) => {
        var connection = getConnection();
        connection.connect();
        connection.query("select f.valaszok as valaszok from feladatsor f where f.id = "+feladatID, function(err, result,fields){
            console.log(err);
            if(!err){
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
function feladatKijav(userValaszok,feladatValaszok){
    let pontok = 0
    for(let i = 0; i<feladatValaszok.length;i++){
        let voltEJo = false
        let valaszLista = feladatValaszok[i].split('/');
        for(let j = 0;j<valaszLista.length;j++){
            if(valaszLista[j].toLowerCase().trim() == userValaszok[i].toLowerCase().trim()){
                voltEJo = true;
                break;
            }
        }
        if(voltEJo||(valaszLista.length==0 && feladatValaszok[i].toLowerCase().trim() == userValaszok[i].toLowerCase().trim())){
            pontok++;
        }
    }
    return pontok
}
function valaszLement(felhasznaloID,pontok,feladatsorID,valaszok){
    return new Promise((resolve) => {
        var connection = getConnection();
        connection.connect();
        connection.query("insert into eredmenyek values(null,"+felhasznaloID+","+pontok+",DEFAULT,"+feladatsorID+",'"+valaszok+"')", function(err, result,fields){
            console.log("insert into eredmenyek values(null,"+felhasznaloID+","+pontok+",DEFAULT,"+feladatsorID+",'"+valaszok+"')")
            if(!err){
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

app.post("/feladatfeltoltes", bodyParser.json(), function(req,res){
    var connection = getConnection();
    connection.connect();
    const felh = req.body.felh;
    const hasheltJelszo = req.body.hasheltJelszo;
    const feladatokParam = req.body.param.feladatokParam;
    const evParam = req.body.param.evParam;
    const honapParam = req.body.param.honapParam;
    const cimParam = req.body.param.cimParam;
    const feladatleirasParam = req.body.param.feladatleirasParam;
    const valaszokParam = req.body.param.valaszokParam;
    const valaszDBParam = req.body.param.valaszDBParam;
    const szintParam = req.body.param.szintParam;
    console.log(req.body);

    felhasznaloValidator(felh,hasheltJelszo).then((lekerdezoAdatai)=>{
        console.log(lekerdezoAdatai);
        if(lekerdezoAdatai!=undefined)
        {
            if(lekerdezoAdatai[0].jog=="admin"){
                connection.query("insert into feladatsor values(NULL,'"+feladatokParam+"',"+evParam+",'"+honapParam+"','"+cimParam+"','"+feladatleirasParam+"','"+valaszokParam+"',"+valaszDBParam+",'"+szintParam+"')" , function(err, result,fields){
                    if(!err){
                        console.log(result);
                        res.send(result);
                    }else{
                        res.send({"Error": 'Hiba a feladat feltöltése során!'});
                    }
                });
            }
            else{
                res.send({"Error": 'Nincs jogosultságod ehhez a művelethez!'});
            }
        }
        else{
            res.send({"Error": 'Nem megfelelő adatok!'});
        }
        connection.end();
    });
});

app.listen(3000);