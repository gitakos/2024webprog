var sessionStorage_transfer = function(event) {
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
        feladatSorGen();
    }
};
  
// listen for changes to localStorage
if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false); 
} else {
    window.attachEvent("onstorage", sessionStorage_transfer);
};


function szovegtordel(){
    var szoveg = document.getElementById("feladatleiras1").innerHTML;
    for (let i = 0; i < szoveg.length; i++) {
        if(szoveg[i] == '•')
        {
            szoveg[i].innerHTML += "<br>";
        }
        
    }
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
let kivalasztottFeladatsorID;
let feladatsorokLista;

function feladatSorGen(){
    kivalasztottFeladatsorID = sessionStorage.getItem("kivalasztottFeladatID");
    feladatsorokLista = sessionStorage.getItem("feladatsorokLista");
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
            Eredmenymegjelenit(valasz.maxpont,valasz.pontok);
        }
    });
}

function HibaALeadasSoran(){
    var div = document.getElementById("szovegresz2");
    div.innerHTML += "<p id='osztalyzat'>Hiba a feladat leadása során!<br>Kérjük próbálja újra!</p>";
}


function Eredmenymegjelenit(max,elert){
    document.getElementById("kuldes").disabled = true;
    var div = document.getElementById("szovegresz2");
    var szazalek = elert/max * 100;
    div.innerHTML += "<p id='osztalyzat'>Szerezhető pont: "+max+"<br> Elért pont: "+elert+"<br> Százalék: "+szazalek+"%</p>";
}

if (sessionStorage.getItem("Login")==undefined) {
    console.log("Elkérem az a datokat UwU")
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
};