function Regful(but)
{
    but.style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("regisztracio").style.display = "flex";
    console.log(hash("123"));
}
function Regvissza()
{
    document.getElementById("RegGombDiv").document.getElementsByTagName("button")[0].style.display = "block";
    document.getElementById("login").style.display = "flex";
    document.getElementById("regisztracio").style.display = "none";
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
            console.log(response[0]);
            /*if(response[0].db!=1)
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
            else{
                console.log("Sikeresen regisztráltál!");
                Regvissza();
            }*/
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
                document.getElementById("MainDiv").style.visibility = "visible";
            }
        })});
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