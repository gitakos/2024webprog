//LKNFDKJÁVFKNLVFKNL HOOOOOOG RIIIIDDDDEEERRRR
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
            // console.log("Nem jó válasz érekezett az adatbázisból");
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            // console.log(response.Error);
            return response;
        } else {
            return response;
        }
    });
}
var lefutott = false;

if(sessionStorage.getItem("Login")=='true'){
    NevekLekerdezAdminListaba();
    document.getElementById("felhnev_adminfel").innerHTML = sessionStorage.getItem("Megnev");
}

function PromoteToAdmin(){//admin felület
    //itt kell a kiválasztott felhasználót adminná tenni
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"adminnatetel",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            console.log(eredmeny.Error);
        }
        else
        {
            if(eredmeny.Valasz.includes("admin")){
                document.getElementById("AdminPromote").innerHTML = "Admin elvétel";
            }else{
                document.getElementById("AdminPromote").innerHTML = "Adminná tétel";
            }
            console.log(eredmeny.Valasz);
        }
    });
}
function FelhasznaloZarolas(){
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"felhasznalozarolas",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            console.log(eredmeny.Error);
        }
        else
        {
            if(eredmeny.Valasz.includes("elérhető")){
                document.getElementById("Zarolas").innerHTML = "Felhasználó zárolása";
            }else{
                document.getElementById("Zarolas").innerHTML = "Zárolás feloldása";
            }
            console.log(eredmeny.Valasz);
        }
    });
}

function emailvaltoztat(){//admin felület
    var uje = document.getElementById("valami").value;
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"emailvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujemail":uje}).then((eredmeny)=>{
        if(eredmeny.Error){
            console.log(eredmeny.Error);
        }
        else
        {
            console.log("Sikeres email cím változtatás.");
        }
    });
}

function nevvaltoztat(){//admin felület
    var ujnev = document.getElementById("valami").value;
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"fnnevvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujnev":ujnev}).then((eredmeny)=>{
        if(eredmeny.Error){
            console.log(eredmeny.Error);
        }
        else
        {
            console.log("Sikeres felhasználónév változtatás.");
        }
    });
}

//TablaSorAdd();
let hanynev = 10;
let felhLista = new Array();
let felhKivalasztott = null;
function NevekLekerdezAdminListaba(){//admin felület
    //Ide kell bepakolni a neveket az adatbázisból akik nem adminok
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"felhasznaloklekerdez",{adminnev:sessionStorage.getItem("Felhasznalonev")}).then((felhasznalok)=>{
        if(felhasznalok.Error){
            console.log(felhasznalok.Error);
            return;
        }
        console.log(felhasznalok)
        felhasznalok.forEach(element => {
            felhLista.push(element.nev);
        });
        let cucc = document.getElementById("myMenu");
        cucc.innerHTML = "";
        for (let i = 0; i < felhLista.length; i++) {
            cucc.innerHTML += "<li><a onclick='felhKivalaszt(this)'>"+felhLista[i]+"</a></li>";
        }
    });
}

function felhKivalaszt(elem){
    //console.log(elem.innerHTML);
    document.getElementById("torlesgomb").disabled = false;
    document.getElementById("JelszoMent").disabled = false;
    document.getElementById("AdminPromote").disabled = false;
    document.getElementById("Zarolas").disabled = false;
    felhKivalasztott = elem.innerHTML;
    let kivalasztottElemek = document.getElementsByClassName("kivalasztottElem");
    if(kivalasztottElemek.length>0){
        kivalasztottElemek[0].classList.remove("kivalasztottElem");
    }
    elem.classList.add("kivalasztottElem");
    document.getElementById("kiválasztottnev").innerHTML = felhKivalasztott;
    adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"jogZaroltLekerdezes",{nev:elem.innerHTML}).then((result)=>{
        if(result[0].jog=="admin"){
            document.getElementById("AdminPromote").innerHTML = "Admin elvétel";
        }else{
            document.getElementById("AdminPromote").innerHTML = "Adminná tétel";
        }
        if(!result[0].zarolt){
            document.getElementById("Zarolas").innerHTML = "Felhasználó zárolása";
        }else{
            document.getElementById("Zarolas").innerHTML = "Zárolás feloldása";
        }
    });
}
//NevekLekerdezAdminListaba();

function errorUzenetGen(element,uzenet){
    let errorJelen = document.createElement("p");
    errorJelen.id = "errorUzenet"
    errorJelen.innerHTML = "Hiba: "+uzenet;
    errorJelen.style.color = "red";
    element.appendChild(errorJelen);
    setTimeout(()=>{document.getElementById("errorUzenet").remove()},3000);
}

function Torles(){//admin felület
    //itt kerül meghívásra a törlésés lekérdezés az index.js-ből
    console.log("TÖRÖLÉS ELKEZDVE!!!");
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"felhasznalotorol",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            console.log("Felhasználó nem lett törölve!");
            errorUzenetGen(document.getElementsByClassName("adminUserForm")[0],eredmeny.Error);
        }
        else
        {
            console.log("A felhasználó sikeresen törölve lett!");
            felhKivalasztott = null;
            document.getElementById("kiválasztottnev").innerHTML = "Nincs kiválasztott fiók!";
            document.getElementsByClassName("kivalasztottElem")[0].remove();
        }
    });
}

function JelszoValt(){//admin felület
    let mezo1 = document.getElementById("ujjelszo").value;
    let mezo2 = document.getElementById("ujjelszoRe").value;
    let infobox = document.getElementById("Ujjelszoadmininfo");
    const regxpw = /^(?=.*[0-9])(?=.*[A-ZÁÉÍÓÖŐÚÜŰ])[a-zA-Z0-9!@#$%^&*._-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{6,16}$/;
    infobox.innerHTML = "";
    if(mezo1 != ""){
        if(regxpw.test(mezo1)){
            if(mezo1 == mezo2){
                let fn = sessionStorage.getItem("Felhasznalonev");
                let pw = sessionStorage.getItem("Jelszo");
                hash(mezo1).then((hex)=>{
                    adatLekerdezes(fn,pw,"jelszovaltoztatas",{felhasznalo:felhKivalasztott,jelszo:hex}).then((eredmeny)=>{
                        if(eredmeny.Error){
                            infobox.innerHTML = "Hiba történt a feltöltés során!";
                        }else{
                            infobox.innerHTML = "A jelszó sikeresen módosult!";
                            mezo1 = "";
                            mezo2 = "";
                        }
                    });
                });
            }else{
    
            }   
        }
        else{
            infobox.innerHTML = "A jelszó nem elég erős";
        }
    }else{
        infobox.innerHTML = "Adja meg az új jelszót!";
    }
    
}

function FeltotoFelulet(){
    window.location.href = "feltolt.html";
}

async function hash(string){
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
}
