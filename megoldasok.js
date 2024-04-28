// Ask other tabs for session storage (this is ONLY to trigger event)
console.log(sessionStorage.getItem("Login"));
/*if (sessionStorage.getItem("Login")==undefined) {
    console.log("Elkérem az a datokat UwU")
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
};*/

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
      Main();
    }
  };
  
  // listen for changes to localStorage
  if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
  };

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
let feladat = undefined
let eredmenyAdat = undefined

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

function FeladatTagol(){
    var div = document.getElementById("feladatleiras1");
    var temp = div.innerText;
    temp = temp.replace(/•/g, "<br>•"); 
    div.innerHTML = temp;
}

function Main(){
    console.log("Main elkezdettLefutni")
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    let eredmenyAdat = sessionStorage.getItem("kivalasztottEredmeny");
    adatLekerdezes(fn,pw,"feladatsorListaLekerdez",undefined).then((feladatSorok)=>{
        console.log(eredmenyAdat);
        console.log(feladatSorok.find((c)=>c.id = eredmenyAdat.feladatid))
        feladat = feladatSorok.find((c)=>c.id = eredmenyAdat.feladatid);

        document.getElementById("feladatleiras1").innerHTML = feladat.fleiras
        document.getElementById("cim1").innerHTML = feladat.cim
        document.getElementById("feladatszoveg1").innerHTML = feladat.fel

        DatumMegjelenit();
        valaszMezoGeneral(feladat.valaszDB);
        FeladatTagol();
        console.log("Main lefutott")
    });
}

Main();