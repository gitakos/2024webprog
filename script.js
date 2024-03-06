function Regful(but)
{
    but.style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("regisztracio").style.display = "flex";
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

function regisztracio()
{
    const regfn = document.getElementById("regFn");
    const regemail = document.getElementById("regemail");
    const regpw = document.getElementById("regPw");
    const regrepw = document.getElementById("regRePw");
    
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