var KozepSzintSelect = true;
let adminFeluletenVanE = document.title=="Admin Felület"
let feladatFeluletVanE = document.title=="Angol érettségi gyakorló"
if(!adminFeluletenVanE){
    if(sessionStorage.getItem("login") == 'true'){
        document.getElementById("BejelentkezesDiv").innerHTML = "";
        document.getElementById("MainDiv").style.display = "block";
        Szintvalasztas(true);
    }else{
        document.getElementById("BejelentkezesDiv").style.visibility = "visible";
        document.getElementById("MainDiv").style.display = "none";
    }
    
}

const adatLekerdezes = (felh,hasheltJelszo,fajta,param) => { //És akkor nem kell kilenc millió post kérést írni
    const data = { felh: felh,hasheltJelszo: hasheltJelszo ,param: param};
    return fetch("http://127.0.0.1:3000/"+fajta, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    .then(function (response) {
        if (!response.ok) {
            // alert("Nem jó válasz érekezett az adatbázisból");
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            // alert(response.Error);
            return response.Error;
        } else {
            return response;
        }
    });
}

function Regful(but,regblock)
{
    if(regblock){
        document.getElementById("login").style.display = "none";
        document.getElementById("regisztracio").style.display = "flex";
        document.getElementById("RegBlockVisszaGomb").style.display = "block";
    }else{
        document.getElementById("login").style.display = "flex";
        document.getElementById("regisztracio").style.display = "none";
        document.getElementById("RegBlockGomb").style.display = "block";
    }
    but.style.display = "none";
}

async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

function reg()
{
    const regfn = document.getElementById("regFn");
    const regxfn = /[a-zA-Z0-9._]{3,16}/;
    const regemail = document.getElementById("regemail");
    const regxeamil = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const regpw = document.getElementById("regPw");
    const regrepw = document.getElementById("regRePw");
    const regxpw = /[a-zA-Z0-9]{6,16}/;
    let infobox = document.getElementById("info");
    if(regfn.value !="" && regxfn.test(regfn.value)){
        if(regemail.value != "" && regxeamil.test(regemail.value)){
            if(regpw.value == regrepw.value && regxpw.test(regpw.value)){
                regisztralasfunction(regfn,regemail,regpw);
            }else{
                infobox.innerHTML = "Jelszó hiba";
                console.log("jelszó hiba");
            }
        }else{
            infobox.innerHTML = "Email hiba";
            console.log("email hiba");
        }
    }else{
        infobox.innerHTML = "Felhasználónév hiba";
        console.log("felhasználónév hiba");
    }
    
}

async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
        return hashHex;
    });
}

function regisztralasfunction(regfn,regemail,regpw){
    hash(regpw.value).then((hex)=>{
        regisztracio(regfn.value,hex,regemail.value).then((response)=>{
            console.log("Válasz megérkezett!:")
            console.log(response);
            if(response.Valasz!=undefined){
                console.log("Sikeresen regisztráltál!");
                Regful(document.getElementById("RegBlockVisszaGomb"),false);
                alert("Sikeres Regisztráció!");
            }
            else
            {
                regfn.style.border = "solid red 2px";
                regfn.style.boxShadow = "red 1px 1px 4px"
                regfn.style.transition = "ease-in-out .3s";
                regemail.style.border = "solid red 2px";
                regemail.style.boxShadow = "red 1px 1px 4px"
                regemail.style.transition = "ease-in-out .3s";
                regpw.style.border = "solid red 2px";
                regpw.style.boxShadow = "red 1px 1px 4px"
                regpw.style.transition = "ease-in-out .3s";
                regrepw.style.border = "solid red 2px";
                regrepw.style.boxShadow = "red 1px 1px 4px"
                regrepw.style.transition = "ease-in-out .3s";
            }
        })});
}

function login()
{
    const fn = document.getElementById("fn");
    const pw = document.getElementById("pw");
    hash(pw.value).then((hex)=>{
        bejelentkezes(fn.value,hex).then((response)=>{
            console.log(response);
            if(response[0].db!=1)
            {
                fn.style.border = "solid red 2px";
                fn.style.boxShadow = "red 1px 1px 4px inset,red 1px 1px 4px";
                fn.style.transition = "ease-in-out .3s";
                pw.style.border = "solid red 2px";
                pw.style.boxShadow = "red 1px 1px 4px inset,red 1px 1px 4px";
                pw.style.transition = "ease-in-out .3s";
            }
            else{
                Main();
            }
        })});
}

function Main(){
    console.log("Sikeresen bejelentkeztél!");
    document.getElementById("BejelentkezesDiv").innerHTML = "";
    document.getElementById("MainDiv").style.display = "block";
    sessionStorage.setItem("login",true);
    Szintvalasztas(true);
}

function Szintvalasztas(kozep){
    KozepSzintSelect = kozep;
    FeladatsorKirakas();
}

function FeladatsorKirakas(){
    //let feladatsorok = [];
    let feladatDiv = document.getElementById("Feladatsorok");
    feladatDiv.innerHTML = "";
    let x = 0;

    adatLekerdezes(null,null,"feladatsorListaLekerdez",null).then((feladatok)=>{
        console.log(feladatok)
        console.log(feladatok.length)
        for(let i = 0 ;i < feladatok.length /* feladatsorok hossza */;i++){
            console.log(i)
            if(x%6==0){
                var SorDiv = document.createElement("div");
                SorDiv.classList.add("row");
                SorDiv.classList.add("SorDiv");
            }
            x++;
            let FeladatsorDiv = document.createElement("div");
            FeladatsorDiv.classList.add("col-12");
            FeladatsorDiv.classList.add("col-sm-4");
            FeladatsorDiv.classList.add("col-lg-2");
            FeladatsorDiv.classList.add("FeladatsorDiv");
    
            let FeladatsorEv = document.createElement("h2");
            FeladatsorEv.innerHTML = feladatok[i].ev+" Év";
            let FeladatsorEvDiv = document.createElement("div");
            FeladatsorEvDiv.classList.add("FeladatsorEvDiv");
            FeladatsorEvDiv.appendChild(FeladatsorEv);
    
            let FeladatImg = document.createElement("img");
            FeladatImg.src = "Kepek/"+(KozepSzintSelect ? "KozepLap" : "EmeltLap")+".png";
            FeladatImg.title = KozepSzintSelect ? "Közép szintű feladatlap" : "Emelt szintű feladatlap";
            FeladatImg.alt = KozepSzintSelect ? "Közép szintű feladatlap" : "Emelt szintű feladatlap";
            let FeladatImgDiv = document.createElement("div");
            // FeladatImgDiv.dataset.szint = "nagy";
            // FeladatImgDiv.dataset.ev = "1";
            // FeladatImgDiv.dataset.honap = "januar";
            FeladatImgDiv.onclick = ()=>{feladatSorGen(FeladatImgDiv);};
            FeladatImgDiv.classList.add("FeladatImgDiv");
            FeladatImgDiv.appendChild(FeladatImg);
    
            let FeladatsorHonap = document.createElement("h3");
            FeladatsorHonap.innerHTML = "x Hónap";
            let FeladatsorHonapDiv = document.createElement("div");
            FeladatsorHonapDiv.classList.add("FeladatsorHonapDiv");
            FeladatsorHonapDiv.appendChild(FeladatsorHonap);
    
            FeladatsorDiv.appendChild(FeladatsorEvDiv);
            FeladatsorDiv.appendChild(FeladatImgDiv);
            FeladatsorDiv.appendChild(FeladatsorHonapDiv);
            SorDiv.appendChild(FeladatsorDiv);
            if(x%6==5 || i==9 /* feladatsorok hossza */ ){
                document.getElementById("Feladatsorok").appendChild(SorDiv);
            }
        }
    })
}

function Logout(){
    sessionStorage.setItem("login",false);
    location.reload();
}

const regisztracio = (felh,hasheltJelszo,email) => {
    const data = { felh: felh,hasheltJelszo: hasheltJelszo ,email: email};
    return fetch("http://127.0.0.1:3000/regisztracio", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    .then(function (response) {
        if (!response.ok) {
            // alert("Nem jó válasz érekezett az adatbázisból");
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            // alert(response.Error);
            return response.Error;
        } else {
            return response;
        }
    });
}

const bejelentkezes = (felh,hasheltJelszo) => {
    const data = { felh: felh,hasheltJelszo: hasheltJelszo };
    return fetch("http://127.0.0.1:3000/bejelentkezes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
    })
    .then(function (response) {
        if (!response.ok) {
            // alert("Nem jó válasz érekezett az adatbázisból");
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            // alert(response.Error);
            return response.Error;
        } else {
            return response;
        }
    });
}

var szovegBe;
function szovegRendezes()
{
    var div = document.getElementById("feladatsor");
    //szöveg tördelés és létrehozás ide
}


function DatumMegjelenit()
{
    let temp = Date().split(' ');
    let honapok = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let magy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
    let datum = temp[3]+". "+magy[honapok.indexOf(temp[1])]+" "+temp[2]+".";
    var csakazertis_VAR = document.getElementsByClassName("Datum");
    for (let i = 0; i < csakazertis_VAR.length; i++) {
        csakazertis_VAR[i].innerHTML = datum;
    }
}

let hanyvalasz = 15; //hány válaszlehetőség van feladatsoronként a nyelvhelyességre

function valaszMezoGeneral(){
    for (let i = 0; i < hanyvalasz; i++) {
        let cucc = document.getElementById("valaszok");
        cucc.innerHTML += "<li><input type='text' class='valaszmezo' name='Valasz' id="+i+"></li>";
    }
}

function TablaSorAdd(nev,datum,feladatsor,maxpont,elertpont,szazalek){
    var table = document.getElementById("tablazat");
    table.innerHTML += "<tr><td>"+nev+"</td><td>"+datum+"</td><td>"+feladatsor+"</td><td>"+maxpont+"</td><td>"+elertpont+"</td><td>"+szazalek+"</td></tr>";
}
//TablaSorAdd();
let hanynev = 10;
let felhLista = new Array();
let felhKivalasztott = null;
function NevekLekerdezAdminListaba(){
    //Ide kell bepakolni a neveket az adatbázisból akik nem adminok
    adatLekerdezes(null,null,"felhasznaloklekerdez").then((felhasznalok)=>{
        felhasznalok.forEach(element => {
            felhLista.push(element.nev);
        });
    
        for (let i = 0; i < felhLista.length&&i<hanynev; i++) {
            let cucc = document.getElementById("myMenu");
            cucc.innerHTML += "<li><a onclick='felhKivalaszt(this)'>"+felhLista[i]+"</a></li>";
        }
    });
}
if(adminFeluletenVanE){
    NevekLekerdezAdminListaba();
}

function felhKivalaszt(elem){
    //console.log(elem.);
    felhKivalasztott = elem.innerHTML;
    let kivalasztottElemek = document.getElementsByClassName("kivalasztottElem");
    if(kivalasztottElemek.length>0){
        kivalasztottElemek[0].classList.remove("kivalasztottElem");
    }
    elem.classList.add("kivalasztottElem");
    document.getElementById("kiválasztottnev").innerHTML = felhKivalasztott;
}
//NevekLekerdezAdminListaba();
function Torles(){
    //itt kerül meghívásra a törlésés lekérdezés az index.js-ből
    adatLekerdezes(null,null,"felhasznalotorol",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            alert("Felhasználó nem lett törölve!");
        }
        else
        {
            alert("A felhasználó sikeresen törölve lett!");
            felhKivalasztott = null;
            document.getElementById("kiválasztottnev").innerHTML = "Nincs kiválasztott fiók!";
            document.getElementsByClassName("kivalasztottElem")[0].remove();
        }
    });
}

function JelszoValt(){
    console.log("Jelszo változtat");
    let mezo1 = document.getElementById("ujjelszo").value;
    let mezo2 = document.getElementById("ujjelszoRe").value;

    if(mezo1 == mezo2  && ErosJelszo(mezo1))
    {
        console.log("Jó a jelszó");
        hash(mezo1).then((hasheltJelsz)=>{
            adatLekerdezes(null,null,"jelszovaltoztatas",{"felhasznalo":felhKivalasztott,"jelszo":hasheltJelsz}).then((eredmeny)=>{
                if(eredmeny.Error){
                    alert("Hiba! Jelszó nem lett megváltoztatva");
                }
                else
                {
                    alert("Jelszó sikeresen megváltoztatva!");
                }
            });
        });
        
    }
    else{
        console.log("Hiba");
    }
}
function ErosJelszo(jelszo){
    const regxpw = /[a-zA-Z0-9]{6,16}/;
    if(regxpw.test(jelszo)){
        return true;
    }
    else{
        return false;
    }
}
function PromoteToAdmin(){
    //itt kell a kiválasztott felhasználót adminná tenni
    adatLekerdezes(null,null,"adminnatetel",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            alert("Hiba! Felhasználó nem lett admin");
        }
        else
        {
            alert("Sikeresen adminá vált a fiók!");
        }
    });
}

function emailvaltoztat(){
    var uje = document.getElementById("valami").value;
    adatLekerdezes(null,null,"emailvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujemail":uje}).then((eredmeny)=>{
        if(eredmeny.Error){
            alert("Hiba! Az email változtatás sikertelen.😊");
        }
        else
        {
            alert("Sikeres email cím változtatás.🤞👏💋");
        }
    });
}

function nevvaltoztat(){
    var ujnev = document.getElementById("valami").value;
    adatLekerdezes(null,null,"fnnevvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujnev":ujnev}).then((eredmeny)=>{
        if(eredmeny.Error){
            alert("Hiba! A felhasználónév változtatás sikertelen.😊");
        }
        else
        {
            alert("Sikeres felhasználónév változtatás.🤞👏💋");
        }
    });
}
//feladatSor változók
let kivalasztottFeladatsorID = 0
let feladatsorokLista = new Array();
function feladatSorGen(){
    document.body.innerHTML = "<div id='oldal1'>"+
    "<div class='align-top row '>"+
            "<div class='col-6'>"+
                "Angol nyelv <a id='szint'>Ide kerül a szint</a>"+
            "</div>"+
            "<div class='col-6 text-end'>"+
                "Név: <a id='nev'>Ide kerül a Felhasználónév</a>"+
            "</div>"+
            "<!-- <div class='clear'></div> -->"+
    "</div>"+
    "<div class='szovegresz' id='szovegresz1'>"+

    "</div>"+
    "<div class='align-bottom row '>"+
        "<div class='col-6'>"+
            "írásbeli vizsga, II. összetevő"+
        "</div>"+
            "<div class='col-6 text-end'>"+
                "<a class='Datum'>Ide kerül be dátum</a>"+
            "</div>"+
        "</div>"+
    "</div>"+

    "<div id='oldal2'>"+
        "<div class='align-top row'>"+
            "<div class='col-6'>"+
                "Angol nyelv <a id='szint'>Ide kerül a szint</a>"+
            "</div>"+
            "<div class='col-6 text-end'>"+
                "Név: <a id='nev'>Ide kerül a Felhasználónév</a>"+
            "</div>"+
            "<!-- <div class='clear'></div> -->"+
        "</div>"+
        
        "<div class='szovegresz' id='szovegresz2'>"+
            "<ol id='valaszok'>"+
                
            "</ol>"+
        "</div>"+
        "<div class='align-bottom row'>"+
            "<div class='col-6'>"+
                "írásbeli vizsga, II. összetevő"+
            "</div>"+
            "<div class='col-6 text-end'>"+
                "<a class='Datum'>Ide kerül be dátum</a>"+
            "</div>"+
        "</div>"+
    "</div>"+
    "<button id='kuldes'>LESSGOO</button>"
    DatumMegjelenit();
    valaszMezoGeneral();
    adatLekerdezes(null,null,"feladatsorListaLekerdez",null).then((feladatsorokDB)=>{
        console.log(feladatsorokDB);
    });
}

var valaszokt;
function valaszokKimentese(){
    adatLekerdezes(null,null,"valaszlekerd").then((valasz)=>{
        if(eredmeny.Error)
        {
            alert("Hiba a valaszok lekérése során");
        }
        else
        {
            alert("sikeres válasz lekérés");
            valaszokt = valasz;
        }
    });
        
}

function valaszokEllenorzese(){
    var valaszok = valaszokt.split(' ');
    var vhossz = valaszok.length;
    
    //Itt kerül ellenőrzésre az adag válasz...
}
