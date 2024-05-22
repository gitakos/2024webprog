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
        div.innerHTML+="<div class='feketekeret' id='sordiv"+i+"'><input type='text' class='valaszmezok' placeholder='Valasz"+(i+1)+"' id='"+i+"valasz'> <button class='pvgombok' onclick='PluszMezoGeneral(this)' id='"+i+"gomb'>+</button><br></div> <br>";
    }
}

function PluszMezoGeneral(gomb){
    var div = document.getElementById("sordiv"+gomb.id[0]);
    div.innerHTML +="<input type='text' placeholder='Valasz"+(Number(gomb.id[0])+1)+" Alválasz' class='"+gomb.id[0]+"Bvalasz valaszmezok'></input><br>";
}

function FelvitelFV(){
    let valaszok = valaszokmentese();
    let feladatleiras= Feladatleirasmentese();
    var foszoveg = document.getElementById("foszoveg").value.trim();
    //console.log(foszoveg)
    var cim = document.getElementById("fcim").value.trim();
    //console.log(cim);

    let ev = document.getElementById("ev").value.trim();
    let honap = document.getElementById("honap").value.trim();

    let szint = document.getElementsByClassName("radiomegj")[0].checked ? "emelt":"közép";

    let fn = sessionStorage.getItem("Felhasznalonev");
    let pw = sessionStorage.getItem("Jelszo");

    adatLekerdezes(fn,pw,"feladatfeltoltes",{feladatokParam:foszoveg,
                                            evParam:ev,honapParam:honap,
                                            cimParam:cim,
                                            feladatleirasParam:feladatleiras,
                                            valaszokParam:valaszok,
                                            valaszDBParam:valaszok.split(";").length,
                                            szintParam:szint}).then((apivalasz)=>{
        console.log(apivalasz);
    });
}

function Feladatleirasmentese(){
    var feladatok = "";
    ures_db = 0;
    for (let i = 1; i < 5; i++) {
        var temp = document.getElementById("fsor"+i);
        if(temp.value.length != 0){
            feladatok += "• ";
            feladatok += temp.value.trim();
        }
        else{
            ures_db++;
        }
    }
    if(ures_db == 4){
        alert("Egy utasítást sem adott meg biztos hogy így akarja folytatni?");
    }
    return feladatok;
}

function valaszokmentese(){
    var valaszok = "";
    //console.log(document.getElementById("megoldszam").value);
    for (let i = 0; i < document.getElementById("megoldszam").value; i++) {
        valaszok += document.getElementById(i+"valasz").value;
        console.log(document.getElementById(i+"valasz").value);
        var temp = document.getElementsByClassName(i+"Bvalasz");
        for (let j = 0; j < temp.length; j++) {
            valaszok+="/"+temp[j].value;
        }
        if(i!=document.getElementById("megoldszam").value-1){
            valaszok += ";";
        }
    }
    return valaszok;
}