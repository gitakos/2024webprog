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


function ValaszokKigeneral(input){
    let div = document.getElementById("valaszok2");
    div.style.display = "block";
    if(input.value<=0){
        div.style.display = "none"
        input.value = 0;
    }
    let db = input.value;
    div.innerHTML = "";
    for(let i = 0;i<db;i++){
        div.innerHTML+="<div class='feketekeret fvalaszmezok' id='sordiv"+i+"'><input type='text' class='valaszmezok' placeholder='Valasz"+(i+1)+"' id='"+i+"valasz'> <button class='pvgombok' onclick='PluszMezoGeneral(this)' id='"+i+"gomb'>+</button><br></div> <br>";
    }
}

function PluszMezoGeneral(gomb){
    let div = document.getElementById("sordiv"+gomb.id[0]);
    div.innerHTML +="<input type='text' placeholder='Valasz"+(Number(gomb.id[0])+1)+" Alválasz' class='"+gomb.id[0]+"Bvalasz valaszmezok'></input><br>";
}

function adminfeluletVissza(){
    window.location.href = "admin.html";
}

function FelvitelFV(){
    let valaszok = valaszokmentese();
    let feladatleiras= Feladatleirasmentese();
    let foszoveg = document.getElementById("foszoveg").value.trim();
    let cim = document.getElementById("fcim").value.trim();
    let ev = document.getElementById("ev").value.trim();
    let honap = document.getElementById("honap").value.trim();
    let szint = document.getElementsByClassName("radiomegj")[0].checked ? "közép":"emelt";
    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");
    let hiba = Uresmezok(valaszok,feladatleiras,foszoveg,cim,ev,honap);
    if(hiba == false){
        adatLekerdezes(fn,pw,"feladatfeltoltes",{feladatokParam:foszoveg,
                                                evParam:ev,honapParam:honap,
                                                cimParam:cim,
                                                feladatleirasParam:feladatleiras,
                                                valaszokParam:valaszok,
                                                valaszDBParam:valaszok.split(";").length,
                                                szintParam:szint}).then((apivalasz)=>{
            if(apivalasz.Error){
                document.getElementById("uzenetbody").innerHTML = apivalasz.Error;
            }
            else
            {
                document.getElementById("FeltoltValaszLabel").innerHTML = "Feltöltve!";
                document.getElementById("uzenetbody").innerHTML = "Sikeres Feltöltés!";
            }
        });
    }else{
        document.getElementById("FeltoltValaszLabel").innerHTML = "Hiba!";
        document.getElementById("uzenetbody").innerHTML = hiba;
    }
}

function Uresmezok(valaszok,feladatleiras,foszoveg,cim,ev,honap){
    let hiba = "";
    let regxevteszt = /^[0-9]{4}$/;
    if(valaszok == false){
        hiba += "Üres válaszmező(k)!</br>";
    }
    if(feladatleiras == false){
        hiba += "Nincs legalább 1 feladatleírás!</br>";
    }
    if(foszoveg == ""){
        hiba += "A feladat szövege üres!</br>";
    }
    if(cim == ""){
        hiba += "A szöveg címe üres!</br>";
    }
    if(!regxevteszt.test(ev) || ev == ""){
        hiba += "Hiányzó vagy rosszul megadott év!</br>";
    }
    if(honap == ""){
        hiba += "Hiányzó hónap!</br>";
    }
    if(hiba == ""){
        return false;
    }else{
        return hiba;
    }
}

function Feladatleirasmentese(){
    let feladatok = "";
    ures_db = 0;
    for (let i = 1; i < 5; i++) {
        let temp = document.getElementById("fsor"+i);
        if(temp.value.length != 0){
            feladatok += "• ";
            feladatok += temp.value.trim();
        }
        else{
            ures_db++;
        }
    }
    if(ures_db == 4){
        return false;
    }
    return feladatok;
}

function valaszokmentese(){
    let valaszok = "";
    for (let i = 0; i < document.getElementById("megoldszam").value; i++){
        if(document.getElementById(i+"valasz").value.trim() == ""){
            return false;
        }
        valaszok += document.getElementById(i+"valasz").value.trim();
        let temp = document.getElementsByClassName(i+"Bvalasz");
        for (let j = 0; j < temp.length; j++){
            if(temp[j].value.trim() != ""){
                valaszok+="/"+temp[j].value;
            }
        }
        if(i!=document.getElementById("megoldszam").value-1){
            valaszok += ";";
        }
    }
    return valaszok;
}