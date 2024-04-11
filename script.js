var KozepSzintSelect = true;
let adminFeluletenVanE = document.title=="Admin Felület";

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
    const regxfn = /^[A-Za-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{6,16}$/;
    const regemail = document.getElementById("regemail");
    const regxeamil = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const regpw = document.getElementById("regPw");
    const regrepw = document.getElementById("regRePw");
    const regxpw = /^(?=.*[0-9])(?=.*[A-ZÁÉÍÓÖŐÚÜŰ])[a-zA-Z0-9!@#$%^&*._-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{6,16}$/;
    let infobox = document.getElementById("info");
    infobox.innerHTML = "";
    let fninfo = document.getElementById("Fninfo");
    fninfo.innerHTML = "";
    let emailinfo = document.getElementById("Emailinfo");
    emailinfo.innerHTML = "";
    let pwinfo = document.getElementById("Pwinfo");
    pwinfo.innerHTML = "";
    let pwujrainfo = document.getElementById("Pwujrainfo");
    pwujrainfo.innerHTML = "";
    let megfelelo = true;
    if(regfn.value =="" || regemail.value == "" || regpw.value == "" || regrepw.value == ""){
        infobox.innerHTML = "Hiányzó adat/adatok!";
        megfelelo = false;
    }else{
        adatLekerdezes(null,null,"felhasznalonevELL",regfn.value).then((valasz) =>
        {
            if(valasz.Valasz){
                fninfo.innerHTML = "Létező felhasználónév!";
                megfelelo = false;
            }
        });
        adatLekerdezes(null,null,"emailELL",regemail.value).then((valasz) =>
        {
            if(valasz.Valasz){
                emailinfo.innerHTML = "Létező email!";
                megfelelo = false;
            }
        });
        if(!regxfn.test(regfn.value)){
            fninfo.innerHTML = "Nem megfelelő felhasználónév!";
            megfelelo = false;
        }
        if(!regxeamil.test(regemail.value)){
            emailinfo.innerHTML = "Nem megfelelő email!";
            megfelelo = false;
        }
        if(!regxpw.test(regpw.value)){
            pwinfo.innerHTML = "Gyenge jelszó!";
            megfelelo = false;
        }
        if(regpw.value != regrepw.value){
            pwujrainfo.innerHTML = "A két megadott jelszó nem egyezik!";
            megfelelo = false;
        }
    }
    if(megfelelo){
        regisztralasfunction(regfn,regemail,regpw);
    }
 
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

//feladatSor változók
let kivalasztottFeladatsorID = 0
let feladatsorokLista = new Array();

function FeladatsorKirakas(){
    //let feladatsorok = [];
    let feladatDiv = document.getElementById("Feladatsorok");
    feladatDiv.innerHTML = "";
    let x = 0;

    adatLekerdezes(null,null,"feladatsorListaLekerdez",null).then((feladatok)=>{
        if(feladatok.Error){
            alert("Hiba a feladatok lekérdezése során")
            return
        }
        feladatsorokLista = feladatok;
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
            FeladatImgDiv.dataset.feladatID = feladatok[i].id;
            FeladatImgDiv.onclick = ()=>{feladatSorGen(FeladatImgDiv);};
            FeladatImgDiv.classList.add("FeladatImgDiv");
            FeladatImgDiv.appendChild(FeladatImg);
    
            let FeladatsorHonap = document.createElement("h3");
            FeladatsorHonap.innerHTML = feladatok[i].honap+" Hónap";
            let FeladatsorHonapDiv = document.createElement("div");
            FeladatsorHonapDiv.classList.add("FeladatsorHonapDiv");
            FeladatsorHonapDiv.appendChild(FeladatsorHonap);
    
            FeladatsorDiv.appendChild(FeladatsorEvDiv);
            FeladatsorDiv.appendChild(FeladatImgDiv);
            FeladatsorDiv.appendChild(FeladatsorHonapDiv);
            SorDiv.appendChild(FeladatsorDiv);
            if(x%6==5 || i==9||i == feladatok.length-1 /* feladatsorok hossza */ ){
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

function valaszMezoGeneral(hanyvalasz){
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
function feladatSorGen(img){
    kivalasztottFeladatsorID = img.dataset.feladatID;
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
    "<div id='szovegresz1'>"+
        "<div class='szovegresz' id='feladatleiras1'>"+

        "</div>"+
        "<br>"+
        "<div class='szovegresz' id='cim1'>"+

        "</div>"+
        "<br>"+
        "<div class='szovegresz' id='feladatszoveg1'>"+

        "</div>"+
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
    "<button id='kuldes' onclick='valaszFelkuldes()'>LESSGOO</button>"
    DatumMegjelenit();
    valaszMezoGeneral(feladatsorokLista.find((c)=>c.id = kivalasztottFeladatsorID).valaszDB);
    document.getElementById("feladatleiras1").innerHTML = feladatsorokLista.find((c)=>c.id = kivalasztottFeladatsorID).fleiras
    document.getElementById("cim1").innerHTML = feladatsorokLista.find((c)=>c.id = kivalasztottFeladatsorID).cim
    document.getElementById("feladatszoveg1").innerHTML = feladatsorokLista.find((c)=>c.id = kivalasztottFeladatsorID).fel
    FeladatTagol();
}

function FeladatTagol(){
    var div = document.getElementById("feladatleiras1");
    var temp = div.innerText;
    temp = temp.replace(/•/g, "<br>•"); 
    div.innerHTML = temp;
}
function valaszFelkuldes(){
    let valaszLista =  document.getElementById("valaszok").getElementsByTagName("li");
    let lista = new Array();
    for(let i = 0;i<valaszLista.length;i++){
        lista.push(valaszLista[i].getElementsByTagName("input")[0].value)
    }
    adatLekerdezes(null,null,"feladatLeadas",{valaszok:lista,feladatID:kivalasztottFeladatsorID}).then((valasz)=>{
        if(valasz.Error){
            alert("Hiba lépett fel a feladat leadása közben")
        }
        else
        {
            alert("Feladat sikeresen leadva!");
        }
    });
}

function szovegtordel(){
    var szoveg = document.getElementById("feladatleiras1").innerHTML;
    for (let i = 0; i < szoveg.length; i++) {
        if(szoveg[i] == '•')
        {
            szoveg[i].innerHTML += "<br>";
        }
        
    }
}
//szovegtordel();

function SideModalAktiv(){
    let diaknev = document.getElementById("SideModalDiakNev");
    diaknev.innerHTML = "NÉV";
}
function EredmenyKimutat(){
    let selectBox = document.getElementById("EredmenySelect")
    selectBox.options[selectBox.selectedIndex].value
    console.log(selectBox.options[selectBox.selectedIndex].value);
}