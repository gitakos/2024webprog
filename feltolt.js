function ValaszokKigeneral(input){
    var db = input.value;
    var div = document.getElementById("valaszok");
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
    console.log(valaszokmentese());
    console.log(Feladatleirasmentese());
    var foszoveg = document.getElementById("foszoveg").value.trim();
    console.log(foszoveg)
    var cim = document.getElementById("fcim").value.trim();
    console.log(cim);
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
    console.log(document.getElementById("megoldszam").value);
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