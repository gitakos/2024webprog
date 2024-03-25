var KozepSzintSelect = true;


// if(sessionStorage.getItem("login")){
//     document.getElementById("BejelentkezesDiv").innerHTML = "";
//     document.getElementById("MainDiv").style.display = "block";
//     Szintvalasztas(true);
// }else{
//     document.getElementById("BejelentkezesDiv").style.visibility = "visible";
//     document.getElementById("MainDiv").style.display = "none";
// }

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
    const regemail = document.getElementById("regemail");
    const regpw = document.getElementById("regPw");
    const regrepw = document.getElementById("regRePw");
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
                fn.style.boxShadow = "red 1px 1px 4px"
                fn.style.transition = "ease-in-out .3s";
                pw.style.border = "solid red 2px";
                pw.style.boxShadow = "red 1px 1px 4px"
                pw.style.transition = "ease-in-out .3s";
            }
            else{
                console.log("Sikeresen bejelentkeztél!");
                document.getElementById("BejelentkezesDiv").innerHTML = "";
                document.getElementById("MainDiv").style.display = "block";
                sessionStorage.setItem("login",true);
                Szintvalasztas(true);
            }
        })});
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
    for(let i = 0 ;i < 10 /* feladatsorok hossza */;i++){
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
        FeladatsorEv.innerHTML = "x Év";
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
        FeladatImgDiv.onclick = ()=>{FeladatsorClick(FeladatImgDiv);};
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
}

function FeladatsorClick(div){
    console.log(div);
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
var valaszok = []
function valaszokKimentese(){
    for (let i = 1; i < 10; i++) {   
        valaszok.push(document.getElementById("valasz"+i).value);   
    }    
   
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
DatumMegjelenit();

let hanyvalasz = 15; //hány válaszlehetőség van feladatsoronként a nyelvhelyességre

function valaszMezoGeneral(){
    for (let i = 0; i < hanyvalasz; i++) {
        let cucc = document.getElementById("valaszok");
        cucc.innerHTML += "<li><input type='text' class='valaszmezo' name='Valasz' id="+i+"></li>";
    }
}
//valaszMezoGeneral();

function TablaSorAdd(nev,datum,feladatsor,maxpont,elertpont,szazalek){
    var table = document.getElementById("tablazat");
    table.innerHTML += "<tr><td>"+nev+"</td><td>"+datum+"</td><td>"+feladatsor+"</td><td>"+maxpont+"</td><td>"+elertpont+"</td><td>"+szazalek+"</td></tr>";
}
//TablaSorAdd("fasz","fasz2","fasz3","fasz4","fasz5","fasz6");
hanynev = 10;
function NevekLekerdezAdminListaba(){
    for (let i = 0; i < hanynev; i++) {
        let cucc = document.getElementById("myMenu");
        cucc.innerHTML += "<li><a>HTML</a></li>";
    }
}
NevekLekerdezAdminListaba();