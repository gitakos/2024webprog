// Ask other tabs for session storage (this is ONLY to trigger event)
/*console.log(sessionStorage.getItem("Login"));
if (sessionStorage.getItem("Login")==undefined) {
    console.log("Elkérem az a datokat UwU")
    localStorage.setItem('getSessionStorage', 'foobar');
    localStorage.removeItem('getSessionStorage', 'foobar');
};*/

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
      Main();
    }
  };*/
  
  // listen for changes to localStorage
  /*if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
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
let feladat = undefined
let eredmenyAdat = undefined

function DatumMegjelenit(date)
{
    let datetemp = date.slice(0,10).split('-');
    let magy = ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
    let datum = datetemp[0]+". "+magy[parseInt(datetemp[1])]+" "+datetemp[2]+".";
    let csakazertis_let = document.getElementsByClassName("Datum");
    for (let i = 0; i < csakazertis_let.length; i++) {
        csakazertis_let[i].innerHTML = datum;
    }
}

function valaszMezoGeneral(hanyvalasz){
    for (let i = 0; i < hanyvalasz; i++) {
        let cucc = document.getElementById("valaszok");
        cucc.innerHTML += "<li><p class='valaszmezo' id="+i+"></p></li>";
    }
}


function valaszElhelyez(hanyvalasz,eredmenyAdat){
    let valaszlista = feladat.valaszok.split(';');
    let megoldasoklista = eredmenyAdat.megadott_valaszok.split(';')
    console.log(megoldasoklista);
    console.log(valaszlista);
    ElertPontszamitas(valaszlista.length,valaszlista,megoldasoklista);
    for(let i = 0; i<hanyvalasz;i++){
        let mezo = document.getElementById(i);
        mezo.innerHTML = "<p style='color: green;'> Ezt adtad meg te: "+megoldasoklista[i]+"</p><p style='color: red;'> Ezek a jó válaszok: "+valaszlista[i]+"</p>";
    }  
    
      
}

function FeladatTagol(){
    let div = document.getElementById("feladatleiras1");
    let temp = div.innerText;
    temp = temp.replace(/•/g, "<br>•"); 
    div.innerHTML = temp;
}


function ElertPontszamitas(hanyvalasz,listav,listam){
    let max = hanyvalasz;
    let elert = 0;
    console.log(listav);
    console.log(listam);
    for(let i = 0;i<listav.length;i++)
    {
        if(listav[i] == listam[i] || (listav[i].includes(listam[i]) && listam[i].length != 0))
        {
            elert++;
        }
    }
    console.log("max: "+max);
    console.log("elert: "+elert);
    Eredmenymegjelenit(max,elert);
}

function Eredmenymegjelenit(max,elert){
    let div = document.getElementById("szovegresz2");
    let szazalek = elert/max * 100;
    div.innerHTML += "<p id='osztalyzat'>Szerezhető pont: "+max+"<br> Elért pont: "+elert+"<br> Százalék: "+szazalek+"%</p>";
}

function Main(){
    console.log("Main elkezdettLefutni")
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    let kivalasztottEredmeny = sessionStorage.getItem("kivalasztottEredmeny");
    adatLekerdezes(fn,pw,"eredmenyeklekerd",undefined).then((eredmenyek)=>{
        eredmenyAdat = eredmenyek.find((c)=>c.id == kivalasztottEredmeny);
        //console.log(eredmenyAdat)
        document.getElementById("megoldasSzint").innerHTML = eredmenyAdat.szint + " szint";
        document.getElementById("megoldasSzint2").innerHTML = eredmenyAdat.szint + " szint";
        document.getElementById("megoldasNev").innerHTML = sessionStorage.getItem("Megnev");
        document.getElementById("megoldasNev2").innerHTML = sessionStorage.getItem("Megnev");
        //console.log(eredmenyAdat); //ezek az eredmények
        adatLekerdezes(fn,pw,"feladatsorListaLekerdez",{megoldas:true, feladatsorid:eredmenyAdat.feladatsorid}).then((feladatres)=>{
            //console.log(feladatSorok.find((c)=>c.id = eredmenyAdat.feladatsorid)); 
            //feladat = feladatSorok.find((c)=>c.id = eredmenyAdat.megoldasid);
            feladat = feladatres[0];
            

            document.getElementById("feladatleiras1").innerHTML = feladat.feladatleiras;
            document.getElementById("cim1").innerHTML = feladat.cim;
            document.getElementById("feladatszoveg1").innerHTML = feladat.feladatok;

            DatumMegjelenit(eredmenyAdat.datum);
            valaszMezoGeneral(feladat.valaszDB);
            FeladatTagol();
            valaszElhelyez(feladat.valaszDB,eredmenyAdat);
            console.log("Main lefutott")
        });
    });
}

Main();