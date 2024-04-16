//LKNFDKJÁVFKNLVFKNL HOOOOOOG RIIIIDDDDEEERRRR

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
    }

    if(adminFeluletenVanE){
        NevekLekerdezAdminListaba();
    }
  };
  
  // listen for changes to localStorage
  if(window.addEventListener) {
    window.addEventListener("storage", sessionStorage_transfer, false);
  } else {
    window.attachEvent("onstorage", sessionStorage_transfer);
  };

  function PromoteToAdmin(){//admin felület
    //itt kell a kiválasztott felhasználót adminná tenni
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"adminnatetel",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            alert(eredmeny.Error);
        }
        else
        {
            alert("Sikeresen adminá vált a fiók!");
        }
    });
}

function emailvaltoztat(){//admin felület
    var uje = document.getElementById("valami").value;
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"emailvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujemail":uje}).then((eredmeny)=>{
        if(eredmeny.Error){
            alert(eredmeny.Error);
        }
        else
        {
            alert("Sikeres email cím változtatás.");
        }
    });
}

function nevvaltoztat(){//admin felület
    var ujnev = document.getElementById("valami").value;
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"fnnevvaltoztatas",{"kivalasztottFelh":felhKivalasztott,"ujnev":ujnev}).then((eredmeny)=>{
        if(eredmeny.Error){
            alert(eredmeny.Error);
        }
        else
        {
            alert("Sikeres felhasználónév változtatás.");
        }
    });
}

//TablaSorAdd();
let hanynev = 10;
let felhLista = new Array();
let felhKivalasztott = null;
function NevekLekerdezAdminListaba(){//admin felület
    //Ide kell bepakolni a neveket az adatbázisból akik nem adminok
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"felhasznaloklekerdez").then((felhasznalok)=>{
        if(felhasznalok.Error){
            alert(felhasznalok.Error);
            return;
        }
        felhasznalok.forEach(element => {
            felhLista.push(element.nev);
        });
        let cucc = document.getElementById("myMenu");
        cucc.innerHTML = "";
        for (let i = 0; i < felhLista.length&&i<hanynev; i++) {
            cucc.innerHTML += "<li><a onclick='felhKivalaszt(this)'>"+felhLista[i]+"</a></li>";
        }
    });
}

function felhKivalaszt(elem){
    //console.log(elem.);
    felhKivalasztott = elem.innerHTML;
    let kivalasztottElemek = document.getElementsByClassName("kivalasztottElem");
    if(kivalasztottElemek.length>0){
        kivalasztottElemek[0].classList.remove("kivalasztottElem");
    }
    elem.classList.add("kivalasztottElem");
    document.getElementById("kiválasztottnev").innerHTML = felhKivalasztott;
}
//NevekLekerdezAdminListaba();
function Torles(){//admin felület
    //itt kerül meghívásra a törlésés lekérdezés az index.js-ből
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    adatLekerdezes(fn,pw,"felhasznalotorol",felhKivalasztott).then((eredmeny)=>{
        if(eredmeny.Error){
            alert("Felhasználó nem lett törölve!");
        }
        else
        {
            alert("A felhasználó sikeresen törölve lett!");
            felhKivalasztott = null;
            document.getElementById("kiválasztottnev").innerHTML = "Nincs kiválasztott fiók!";
            document.getElementsByClassName("kivalasztottElem")[0].remove();
        }
    });
}

function JelszoValt(){//admin felület
    console.log("Jelszo változtat");
    let mezo1 = document.getElementById("ujjelszo").value;
    let mezo2 = document.getElementById("ujjelszoRe").value;

    if(mezo1 == mezo2  && ErosJelszo(mezo1))
    {
        console.log("Jó a jelszó");
        let fn = sessionStorage.getItem("Felhasznalonev");
        let pw = sessionStorage.getItem("Jelszo");
        hash(mezo1).then((hasheltJelsz)=>{
            adatLekerdezes(fn,pw,"jelszovaltoztatas",{"felhasznalo":felhKivalasztott,"jelszo":hasheltJelsz}).then((eredmeny)=>{
                if(eredmeny.Error){
                    alert("Hiba! Jelszó nem lett megváltoztatva");
                }
                else
                {
                    alert("Jelszó sikeresen megváltoztatva!");
                }
            });
        });
        
    }
    else{
        console.log("Hiba");
    }
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