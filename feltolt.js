
function ValaszokKigeneral(input){
    var db = input.value;
    var div = document.getElementById("valaszok");
    div.innerHTML = "";

    if (db<= 0){
        input.value = 0
        div.style.display = "none"
        return
    }
    else{
        div.style.display = "block"
    }

    for(let i = 0;i<db;i++){
        div.innerHTML+="<div class='feketekeret' id='sordiv"+i+"'><input type='text' class='valaszmezok' placeholder='Valasz"+(i+1)+"' id='"+i+"valasz'> <button class='pvgombok' onclick='PluszMezoGeneral(this)' id='"+i+"gomb'>+</button><br></div> <br>";
    }
}

function PluszMezoGeneral(gomb){
    var div = document.getElementById("sordiv"+gomb.id[0]);
    div.innerHTML +="<input type='text' placeholder='Valasz"+(Number(gomb.id[0])+1)+" Alválasz' class='"+gomb.id[0]+"Bvalasz valaszmezok'></input><br>";
}

function FelvitelFV(){
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
    console.log(valaszok);
}