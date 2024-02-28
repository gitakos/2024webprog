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

function login()
{
    const fn = document.getElementById("fn");
    const pw = document.getElementById("pw");

    //ha rossz
    fn.style.border = "solid red 2px";
    fn.style.boxShadow = "red 1px 1px 4px"
    fn.style.transition = "ease-in-out .3s";
    pw.style.border = "solid red 2px";
    pw.style.boxShadow = "red 1px 1px 4px"
    pw.style.transition = "ease-in-out .3s";
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