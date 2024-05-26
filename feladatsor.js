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
  
// listen for changes to localStorage
/*if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false); 
} else {
    window.attachEvent("onstorage", sessionStorage_transfer);
};*/


function szovegtordel(){
    let szoveg = document.getElementById("feladatleiras1").innerHTML;
    for (let i = 0; i < szoveg.length; i++) {
        if(szoveg[i] == '•')
        {
            szoveg[i].innerHTML += "<br>";
        }
        
    }
}

function DatumMegjelenit()
{
    let temp = Date().split(' ');
    let honapok = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let magy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
    let datum = temp[3]+". "+magy[honapok.indexOf(temp[1])]+" "+temp[2]+".";
    let csakazertis_let = document.getElementsByClassName("Datum");
    for (let i = 0; i < csakazertis_let.length; i++) {
        csakazertis_let[i].innerHTML = datum;
    }
}

function valaszMezoGeneral(hanyvalasz){
    for (let i = 1; i <= hanyvalasz; i++) {
        let cucc = document.getElementById("valaszok");
        cucc.innerHTML += "<li><input type='text' class='valaszmezo' name='Valasz' id=Valasz"+i+"><label class='valaszLabel' for='Valasz"+i+"'></label></li>";
    }
}

function TablaSorAdd(nev,datum,feladatsor,maxpont,elertpont,szazalek){
    let table = document.getElementById("tablazat");
    table.innerHTML += "<tr><td>"+nev+"</td><td>"+datum+"</td><td>"+feladatsor+"</td><td>"+maxpont+"</td><td>"+elertpont+"</td><td>"+szazalek+"</td></tr>";
}
let kivalasztottFeladatsorID;
let feladatsorokLista;

function feladatSorGen(){
    document.getElementById("feladatsorSzint").innerHTML = sessionStorage.getItem("kivalasztottFeladatSzint");
    document.getElementById("feladatsorSzint2").innerHTML = sessionStorage.getItem("kivalasztottFeladatSzint");
    document.getElementById("feladatsorNev").innerHTML = sessionStorage.getItem("Megnev");
    document.getElementById("feladatsorNev2").innerHTML = sessionStorage.getItem("Megnev");
    kivalasztottFeladatsorID = sessionStorage.getItem("kivalasztottFeladatID");
    console.log(kivalasztottFeladatsorID);
    DatumMegjelenit();
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"feladatsorListaLekerdez",{megoldas:false, feladatsorid:undefined}).then((feladatok)=>{
        console.log(feladatok);
        feladatsorokLista = feladatok;
        valaszMezoGeneral(feladatsorokLista.find((c)=>c.id == kivalasztottFeladatsorID).valaszDB);
        document.getElementById("feladatleiras1").innerHTML = feladatsorokLista.find((c)=>c.id == kivalasztottFeladatsorID).feladatleiras;
        document.getElementById("cim1").innerHTML = feladatsorokLista.find((c)=>c.id == kivalasztottFeladatsorID).cim;
        document.getElementById("feladatszoveg1").innerHTML = feladatsorokLista.find((c)=>c.id == kivalasztottFeladatsorID).feladatok;
        FeladatTagol();
    });
}

function FeladatTagol(){
    let div = document.getElementById("feladatleiras1");
    let temp = div.innerText;
    temp = temp.replace(/•/g, "<br>•"); 
    div.innerHTML = temp;
}

function valaszFelkuldes(){
    let valaszLista = document.getElementById("valaszok").getElementsByTagName("li");
    let lista = new Array();
    for(let i = 0;i<valaszLista.length;i++){
        if(valaszLista[i].getElementsByTagName("input")[0].value == undefined){
            lista.push("%URES%");
        }
        else
        {
            lista.push(valaszLista[i].getElementsByTagName("input")[0].value)
        }
    }
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"feladatLeadas",{valaszok:lista,feladatID:kivalasztottFeladatsorID}).then((valasz)=>{
        if(valasz.Error){
            HibaALeadasSoran();
            console.log(valasz.Error);
        }
        else
        {
            console.log(valasz);
            Eredmenymegjelenit(valasz);
        }
    });
}

function HibaALeadasSoran(){
    let div = document.getElementById("szovegresz2");
    div.innerHTML += "<p id='osztalyzat'>Hiba a feladat leadása során!<br>Kérjük próbálja újra!</p>";
}


function Eredmenymegjelenit(valasz){
    document.getElementById("kuldes").disabled = true;
    document.getElementById("kuldes").textContent = "Leadva";
    let megoldasok = valasz.jovalaszok.split(';');
    for(let i = 0;i<megoldasok.length;i++){
        let mezo = document.getElementById("Valasz"+(i+1)+"");
        mezo.disabled = true;
        let elfogadhatomegoldasok = megoldasok[i].split('/');
        // console.log(elfogadhatomegoldasok)
        let voltjo = false;
        for(let j = 0;j<elfogadhatomegoldasok.length;j++){
            if(!voltjo && elfogadhatomegoldasok[j] == mezo.value.toLowerCase()){
                mezo.parentElement.classList.add("m");
                voltjo = true;
            }
        }
        if(!voltjo){
            mezo.parentElement.classList.add("j");
        }
        mezo.parentElement.getElementsByTagName("label")[0].innerText = "Lehetséges helyes megoldások: "+megoldasok[i]
    }
    let div = document.getElementById("pontertekeles");
    div.innerHTML += "<p id='osztalyzat'>"+valasz.maxpont+" / "+valasz.pontok+"</p>";
    let szazalek = valasz.pontok/valasz.maxpont * 100;
    let div2 = document.getElementById("szazalekertekeles");
    div2.innerHTML += "<p id ='osztalyzat'>"+szazalek+" %</p>";
}

/*if (sessionStorage.getItem("Login")==undefined) { //Már nem kell
    console.log("Elkérem az a datokat UwU")
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
};*/

feladatSorGen();