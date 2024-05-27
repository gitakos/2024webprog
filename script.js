var KozepSzintSelect = true;
var Admingomb = false;

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
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            return response;
        } else {
            return response;
        }
    });
}

if(sessionStorage.getItem("Login") == 'true'){
    document.getElementById("BejelentkezesDiv").innerHTML = "";
    document.getElementById("MainDiv").classList = "MainDivS";
    document.getElementById("Profil").innerHTML = '<img src="Kepek/pfpicon.png" alt="ProfilIcon"type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#SideModal" onclick="SideModalAktiv()"></img>';
    Szintvalasztas(true);
    adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"joglekerdez",{nev:sessionStorage.getItem("Felhasznalonev")}).then((result)=>{
        sessionStorage.setItem("AdminUser",result[0].jog);
    });
}else{
    document.getElementById("BejelentkezesDiv").style.visibility = "visible";
    document.getElementById("MainDiv").classList = "MainDivH";
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
        regisztralasfunction(regfn,regemail,regpw,regrepw,infobox);
    }
 
}


function regisztralasfunction(regfn,regemail,regpw,regrepw,infobox){
    hash(regpw.value).then((hex)=>{
        regisztracio(regfn.value,hex,regemail.value).then((response)=>{
            console.log("Válasz megérkezett!:")
            console.log(response);
            if(response.Valasz!=undefined){
                
                console.log("Sikeresen regisztráltál!");
                regfn.value = '';
                regemail.value = '';
                regpw.value = '';
                regrepw.value = ''; 
                window.location.href = "index.html";
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
                fn.classList.add("Error");
                pw.classList.add("Error");
                document.getElementById("LoginInfo").innerHTML = "Hibás felhasználónév vagy jelszó!";
            }
            else{
                adatLekerdezes(fn.value,hex,"useradatlekerdez",null).then((valasz) =>{
                    if(!valasz[0].zarolt){
                        sessionStorage.setItem("AdminUser",valasz[0].jog);
                        sessionStorage.setItem("Megnev",valasz[0].megnev);
                        document.getElementById("Profil").innerHTML = '<img src="Kepek/pfpicon.png" alt="ProfilIcon"type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#SideModal" onclick="SideModalAktiv()"></img>';
                        sessionStorage.setItem("Login",true);
                        sessionStorage.setItem("Felhasznalonev",fn.value);
                        sessionStorage.setItem("Jelszo",hex);
                        Admingomb = false;
                        document.getElementById("LoginInfo").innerHTML = "";
                        Main();
                    }else{
                        fn.classList.add("Error");
                        pw.classList.add("Error");
                        document.getElementById("LoginInfo").innerHTML = "A felhasználó zárolva van!";
                    }
                });
            }
        })});
}

function Main(){
    console.log("Sikeresen bejelentkeztél!");
    document.getElementById("BejelentkezesDiv").innerHTML = "";
    document.getElementById("MainDiv").style.display = "block";
    Szintvalasztas(true);
}

function Szintvalasztas(kozep){
    if(sessionStorage.getItem("Login")=='true'){
        KozepSzintSelect = kozep;
        FeladatsorKirakas();
    }
}

function FeladatLekerdHiba(){
    var div = document.getElementById("Feladatsorok");
    var tartalom = "Hiba lépett fel a feladatsorok lekérdezése során";
    div.innerHTML = "<div id='fsorhiba'>"+tartalom+"</div>";
}

//feladatSor változók
let kivalasztottFeladatsorID = 0
let feladatsorokLista = new Array();

function FeladatsorKirakas(){
    let feladatDiv = document.getElementById("Feladatsorok");
    feladatDiv.innerHTML = "";
    let x = 0;

    adatLekerdezes(null,null,"feladatsorListaLekerdez",{megoldas:false, feladatsorid:undefined}).then((feladatok)=>{
        if(feladatok.Error){
            FeladatLekerdHiba();
            return
        }
        console.log(feladatok);
        if(KozepSzintSelect){
            feladatok = feladatok.filter((c)=>c.szint=="közép");
        }
        else{
            feladatok = feladatok.filter((c)=>c.szint=="emelt");
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
            FeladatsorEv.innerHTML = feladatok[i].ev;
            let FeladatsorEvDiv = document.createElement("div");
            FeladatsorEvDiv.classList.add("FeladatsorEvDiv");
            FeladatsorEvDiv.appendChild(FeladatsorEv);
    
            let FeladatImg = document.createElement("img");
            FeladatImg.src = "Kepek/"+(KozepSzintSelect ? "KozepLap" : "EmeltLap")+".png";
            FeladatImg.title = KozepSzintSelect ? "Közép szintű feladatlap" : "Emelt szintű feladatlap";
            FeladatImg.alt = KozepSzintSelect ? "Közép szintű feladatlap" : "Emelt szintű feladatlap";
            let FeladatImgDiv = document.createElement("div");
            FeladatImgDiv.dataset.feladatID = feladatok[i].id;
            FeladatImgDiv.dataset.feladatSzint = KozepSzintSelect ? "közép szint" : "emelt szint";
            FeladatImgDiv.setAttribute('onclick',"feladatKivalaszt(this)");
            FeladatImgDiv.classList.add("FeladatImgDiv");
            FeladatImgDiv.appendChild(FeladatImg);
            

            let FeladatsorHonap = document.createElement("h3");
            FeladatsorHonap.innerHTML = feladatok[i].honap;
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
            //Valami baj van a kiválasztással
        }
    })
}
function feladatKivalaszt(elem){
    sessionStorage.setItem("kivalasztottFeladatID",elem.dataset.feladatID);
    sessionStorage.setItem("kivalasztottFeladatSzint",elem.dataset.feladatSzint);
    sessionStorage.setItem("feladatsorokLista",feladatsorokLista);
    window.location.href = "feladatsor.html";
}

function Logout(){
    sessionStorage.setItem("Login",false);
    sessionStorage.removeItem("AdminUser");
    sessionStorage.removeItem("Felhasznalonev");
    sessionStorage.removeItem("Jelszo");
    Admingomb = false;
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
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
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
            return Promise.reject("Nem jó válasz érekezett az adatbázisból");
        }
        return response.json();
    })
    .then(function (response) {
        if (response.Error) {
            return response.Error;
        } else {
            return response;
        }
    });
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
//szovegtordel();

function SideModalAktiv(){
    let diaknev = document.getElementById("SideModalDiakNev");
    let mnev = sessionStorage.getItem("Megnev");
    if(sessionStorage.getItem("AdminUser")=="admin"){
        diaknev.innerHTML = mnev+" (admin)";
        if(!Admingomb){
            Admingomb = true;
            document.getElementById("SidemodalBody").innerHTML += '<div class="col-sm-12 form-group" id="AdminGomb"> <button onclick="AdminOldal()"><a>Admin Felület</a></button> </div>';
        }
    }else{
        diaknev.innerHTML = mnev;
    }
    EredmenyekLekerdez();
}
function AdminOldal(){
    window.location.href = "admin.html";
}

var eredmenyekg;

function EredmenyekLekerdez(){
    console.log("hehre1");
    let selectBox = document.getElementById("EredmenySelect")
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");

    adatLekerdezes(fn,pw,"eredmenyeklekerd",null).then((eredmenyek)=>{
        sessionStorage.setItem("kivalasztottEredmeny",undefined);
        selectBox.innerHTML = "<option selected='selected'>Válasszon egy dátumot!</option>";
        console.log(eredmenyek);
        eredmenyekg = eredmenyek;
        for(let i = 0;i<eredmenyek.length;i++)
        {
            let tempdate = eredmenyek[i].datum.slice(0,10).split('-');
            selectBox.innerHTML += "<option id='lehetoseg'>"+tempdate[0]+'.'+tempdate[1]+'.'+tempdate[2]+"</option>";
        }   
    });
}

function EredmenyKimutat(){
    console.log("hehre!");
    let selectBox = document.getElementById("EredmenySelect");
    console.log(selectBox.selectedIndex);
    console.log(eredmenyekg[selectBox.selectedIndex-1]);
    sessionStorage.setItem("kivalasztottEredmeny",eredmenyekg[selectBox.selectedIndex-1].id);
    console.log(sessionStorage.getItem("kivalasztottEredmeny")+" szaaaart");
    window.location.href = "megoldasok.html";
}

function MegNevvaltasGomb(){
    let mentesgomb = document.getElementById("nevValtGomb");
    let nevValtConfirm = document.getElementById("nevValtConf");
    let nevvaltasinfo = document.getElementById("felhasznalonevValtInfo");
    nevvaltasinfo.innerHTML = "";
    let regiNev = document.getElementById("felhasznalonevValtJelenlegi").value;
    let ujNev = document.getElementById("felhasznalonevValtUj").value;
    const regxnev = /^[A-Za-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,16}$/;

    let lista = []
    lista.push(document.getElementById("felhasznalonevValtJelenlegi"));
    lista.push(document.getElementById("felhasznalonevValtUj"));
    uresMezoCheck(lista);

    if(regiNev == sessionStorage.getItem("Megnev") && regiNev != "" && ujNev != ""){
        if(regxnev.test(ujNev)){
            mentesgomb.style.backgroundColor = "#71ff4dc7";
            mentesgomb.setAttribute("onclick","MegNevValtConf()");
            let megsegomb = document.createElement("button");
            megsegomb.id = "nevmegsetemp";
            megsegomb.textContent = "Mégsem";
            megsegomb.setAttribute("onclick","MegNevvaltreset()");
            megsegomb.style.backgroundColor = "#ff4d4dc7";
            megsegomb.style.transition = "ease-in-out .3s";
            nevValtConfirm.appendChild(megsegomb);
        }else{
            nevvaltasinfo.innerHTML = "A név túl hosszú, vagy speciális karaktert tartalmaz!";    
        }
    }else{
        nevvaltasinfo.innerHTML = "Rosszul adta meg a jelenlegi nevét!";
    }
}
function MegNevvaltreset(){
    let mentesgomb = document.getElementById("nevValtGomb");
    mentesgomb.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
    document.getElementById("nevmegsetemp").remove();
    mentesgomb.setAttribute("onclick","MegNevvaltasGomb()");
    document.getElementById("felhasznalonevValtJelenlegi").value = '';
    document.getElementById("felhasznalonevValtUj").value = '';
}
function MegNevValtConf(){
    let ujNev = document.getElementById("felhasznalonevValtUj").value;
    let nevvaltasinfo = document.getElementById("felhasznalonevValtInfo");
    adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"megnev",{hova:"megnevValt",ujmegnev:ujNev});
    sessionStorage.setItem("Megnev",ujNev);
    nevvaltasinfo.innerHTML = "A név sikeresen módosult!"; 
    MegNevvaltreset();
    SideModalAktiv();
}

function JelszovaltasGomb(){
    let mentesgomb = document.getElementById("jelszoValtGomb");
    let jelszovaltasinfo = document.getElementById("jelszoValtInfo");
    let jelszoValtConfirm = document.getElementById("jelszoValtConf");
    jelszovaltasinfo.innerHTML = "";
    let regiPw = document.getElementById("jelszoValtJelenlegi").value;
    let ujPw = document.getElementById("jelszoValtUj").value;
    let ujPwre = document.getElementById("jelszoValtUjRe").value;
    const regxpw = /^(?=.*[0-9])(?=.*[A-ZÁÉÍÓÖŐÚÜŰ])[a-zA-Z0-9!@#$%^&*._-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{6,16}$/;

    let lista = []
    lista.push(document.getElementById("jelszoValtJelenlegi"));
    lista.push(document.getElementById("jelszoValtUj"));
    lista.push(document.getElementById("jelszoValtUjRe"));
    uresMezoCheck(lista);

    if(regiPw != "" && ujPw != "" && ujPwre != ""){
        hash(regiPw).then((hex)=>{
            if(hex == sessionStorage.getItem("Jelszo")){
                if(regxpw.test(ujPw)){
                    if(ujPw == ujPwre){
                        mentesgomb.style.backgroundColor = "#71ff4dc7";
                        mentesgomb.setAttribute("onclick","JelszoValtConf()");
                        let megsegomb = document.createElement("button");
                        megsegomb.id = "jelszomegsetemp";
                        megsegomb.textContent = "Mégsem";
                        megsegomb.setAttribute("onclick","Jelszovaltreset()");
                        megsegomb.style.backgroundColor = "#ff4d4dc7";
                        megsegomb.style.transition = "ease-in-out .3s";
                        jelszoValtConfirm.appendChild(megsegomb);
                    }else{
                        jelszovaltasinfo.innerHTML = "A két jelszó nem egyezik!";  
                    }
                }else{
                    jelszovaltasinfo.innerHTML = "Az új jelszó túl gyenge!";    
                }
            }else{
                jelszovaltasinfo.innerHTML = "A jelenlegi jelszó nem megfelelő!";
            }
        });
    }
}
function uresMezoCheck(lista){
    for(let i = 0; i<lista.length;i++){
        lista[i].parentElement.getElementsByTagName("label")[0].style.display = "none";
        if(lista[i].value.trim()==''){
            lista[i].parentElement.getElementsByTagName("label")[0].style.display = "block";
        }
    }
}


function Jelszovaltreset(){
    let mentesgomb = document.getElementById("jelszoValtGomb");
    mentesgomb.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
    document.getElementById("jelszomegsetemp").remove();
    mentesgomb.setAttribute("onclick","JelszovaltasGomb()");
    document.getElementById("jelszoValtJelenlegi").value = '';
    document.getElementById("jelszoValtUj").value = '';
    document.getElementById("jelszoValtUjRe").value = '';
}
function JelszoValtConf(){
    let ujJelszo = document.getElementById("jelszoValtUj").value;
    let jelszovaltasinfo = document.getElementById("jelszoValtInfo");

    hash(ujJelszo).then((hex)=>{
        adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"userjelszovalt",{jelszo:hex}).then((result)=>{
            if(!result.Error){
                sessionStorage.setItem("Jelszo",hex);
            }
        }
    )});
    jelszovaltasinfo.innerHTML = "A jelszó sikeresen módosult!"; 
    Jelszovaltreset();
}

function EmailvaltasGomb(){
    let mentesgomb = document.getElementById("emailValtGomb");
    let emailvaltasinfo = document.getElementById("emailValtInfo");
    let emailValtConfirm = document.getElementById("emailValtConf");
    emailvaltasinfo.innerHTML = "";
    let ujEmail = document.getElementById("EmailValtUj").value;
    let emailvaltPw = document.getElementById("EmailValtJelszo").value;
    const regxeamil = /^[a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    let lista = []
    lista.push(document.getElementById("EmailValtUj"));
    lista.push(document.getElementById("EmailValtJelszo"));
    uresMezoCheck(lista);

    if(ujEmail != "" && emailvaltPw != ""){
        if(regxeamil.test(ujEmail)){
            hash(emailvaltPw).then((hex)=>{
                if(hex==sessionStorage.getItem("Jelszo")){
                    adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"emailELL",ujEmail).then((result)=>{
                        if(!result.Valasz){
                            mentesgomb.style.backgroundColor = "#71ff4dc7";
                            mentesgomb.setAttribute("onclick","EmailValtConf()");
                            let megsegomb = document.createElement("button");
                            megsegomb.id = "emailmegsetemp";
                            megsegomb.textContent = "Mégsem";
                            megsegomb.setAttribute("onclick","Emailvaltreset()");
                            megsegomb.style.backgroundColor = "#ff4d4dc7";
                            megsegomb.style.transition = "ease-in-out .3s";
                            emailValtConfirm.appendChild(megsegomb);
                        }else{
                            emailvaltasinfo.innerHTML = "Ez az emailcím már használatban van!";                   
                        }
                    });
                }else{
                    emailvaltasinfo.innerHTML = "Nem jó jelszó!";        
                }
            });
        }else{
            emailvaltasinfo.innerHTML = "Az új emailcím nem megfelelő!";
        }
    }
}
function Emailvaltreset(){
    let mentesgomb = document.getElementById("emailValtGomb");
    mentesgomb.style.backgroundColor = "rgba(128, 128, 128, 0.3)";
    document.getElementById("emailmegsetemp").remove();
    mentesgomb.setAttribute("onclick","EmailvaltasGomb()");
    document.getElementById("EmailValtUj").value = '';
    document.getElementById("EmailValtJelszo").value = '';
}
function EmailValtConf(){
    let ujEmail = document.getElementById("EmailValtUj").value;
    let emailvaltasinfo = document.getElementById("emailValtInfo");
    adatLekerdezes(sessionStorage.getItem("Felhasznalonev"),sessionStorage.getItem("Jelszo"),"useremailvalt",{email:ujEmail});
    emailvaltasinfo.innerHTML = "Az emailcím sikeresen módosult!"; 
    Emailvaltreset();
}

/*var sessionStorage_transfer = function(event) {
    console.log("Ide bekéne");
    if(!event) { event = window.event; } // ie suq
    if (event.key == 'getSessionStorage') {
      // another tab asked for the sessionStorage -> send it
      localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
      // the other tab should now have it, so we're done with it.
      localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
    } else if (event.key == 'sessionStorage') {
      // another tab sent data <- get it
      var data = JSON.parse(event.newValue);
      for (var key in data) {
        if(key!="IsThisFirstTime_Log_From_LiveServer"){
            console.log(key+" adata át mentve!");
            sessionStorage.setItem(key, data[key]);
        }
      }
    }
  };*/
  
  // listen for changes to localStorage
  /*if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
  };*/