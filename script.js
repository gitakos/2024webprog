function Regful(but)
{
    but.style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("regisztracio").style.display = "flex";
}

function regisztracio()
{
    const regfn = document.getElementById("regFn").value;
    const regemail = document.getElementById("regemail").value;
    const regpw = document.getElementById("regPw").value;
    const regrepw = document.getElementById("regRePw").value;
    
}

function login()
{
    const fn = document.getElementById("fn").value;
    const pw = document.getElementById("pw").value;
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