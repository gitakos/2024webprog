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