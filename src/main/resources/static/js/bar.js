/*
    JavaScript Funktionen für die bar.html Seite des Beverage Monitoring
*/

//Beim öffnen / neu laden der Seite
window.onload = () => { 
    generateNextOrders(); //Alle offenen Bestellungen generieren
    updateRfidConnection(true); //RFID Verbindungsanzeige
    //TODO RFID Verbindungsstatus abfragen
}

//Zur ToDo Area zugehörige DoneArea ermitteln und zurückgeben
let getDoneArea = (toDoArea)  => {
    return document.getElementById("done" + toDoArea.id.slice(-1));
}

//Rekursiv die erste leere Spalte ermitteln, um neue Bestellung zu generieren
let getFirstEmptyColumn = (count = 1) => { //count default beginnt bei 1
    //Wenn die Zelle leer ist, wird sie zurückgegeben und die Funktion beendet
    //Ist die Zeile gefüllt, wird die Funktion erneut mit erhöhtem counter aufgerufen
    let id = "toDo" + count;
    let el = document.getElementById(id);
    if(el == null || el.innerHTML == "") {
        return el; //Leere Spalte zurückgeben
    } else return getFirstEmptyColumn(++count); //Funktion erneut durchführen
};

//Getränk fertig vorbereitet
let drinkDone = (drinkId) => {
    drink = document.getElementById(drinkId);
    toDoArea = drink.parentElement;
    doneArea = getDoneArea(toDoArea); //Done Area ermitteln
    doneArea.appendChild(drink); //Drink von ToDo entfernen und Done anhängen
    
    //Wenn durch den Drink alle Bestellungen für den Tisch abgeschlossen wurden, wird eine neue Lieferung angelegt und alle Bestellungen rücken von rechts nach links auf
    if(toDoArea.childElementCount == 1) {
        newDelivery(toDoArea.firstElementChild.innerHTML); //Neue Lieferung anlegen
        moveOrders(toDoArea); //Von Rechts nach Links aufrücken
    }
};

//Neue Lieferung für bestimmte Tischnummer in linker Spalte hinzufügen
let newDelivery = (tablenumber) => {
    let deliverCol = document.getElementById("delivery_items"); //Lieferspalte ermitteln
    let template = document.getElementById("outgoing_delivery"); //Template ermitteln
    let newDeliveryElement = template.content.cloneNode(true); //Template content copieren
    let spans = newDeliveryElement.querySelectorAll('span'); //Spans des Templates auswählen
    spans[0].textContent = tablenumber; //ersten Span mit Tischnummer beschriften
    deliverCol.appendChild(newDeliveryElement); //Lieferung der Spalte hinzufügen
    startTimer(spans[1]); //Timer in zweitem Span starten
};

//Alle Bestellungen rechts des fertiggestellten Bereichs nach links verschieben
let moveOrders = (finishedArea) => {
    if(finishedArea.id == "toDo4") { //Wenn der fertiggestellte Bereich ganz rechts ist
        finishedArea.innerHTML = ""; //Bereich leeren
        document.getElementById("done4").innerHTML = ""; //Bereich leeren
        generateNextOrders(); //Neue Bestellung aus Backlog generieren
        return; //Ende der Rekursion
    }
    let nextToDoArea = finishedArea.parentElement.nextElementSibling.firstElementChild; //nächsten Bereich ermitteln
    let doneArea = getDoneArea(finishedArea); //DoneArea zu finishedArea ermitteln
    let nextDoneArea = doneArea.parentElement.nextElementSibling.firstElementChild; //nächste Done Area ermitteln
    finishedArea.innerHTML = nextToDoArea.innerHTML; //ToDo von Rechts nach Links kopieren
    doneArea.innerHTML = nextDoneArea.innerHTML; //Done von Rechts nach Links kopieren
    moveOrders(nextToDoArea); //Rekursion --> Methode mit Rechter Spalte (nextToDoArea) wiederholen
};

//Nächste Spalten mit Bestellungen generieren
let generateNextOrders = () => {
    fetch("./api/getOffeneBestellungen").then( //fetch Spring Endpoint
        response => {return response.json();} //parse response zu json
    ).then(
        data => {
            while((toDoArea = getFirstEmptyColumn()) != null) { //solange es weitere leere Spalten gibt
                data.bestellungen.some(order => { //durch alle Bestellungen iterieren
                    if(document.getElementById("drink_" + order.id) == null){ //wenn die Bestellung noch nicht auf dem Frontend vorhanden ist
                        toDoArea.innerHTML = '<div class="order_tablenumber">Tisch '+ order.tischId +'</div>'; //Spalte für Tischnummer der Bestellung anlegen
                        generateOrdersForTable(data, order.tischId, toDoArea); //Alle offenen Bestellungen für den gewählten Tisch erzeugen
                        return true; //Iterieren beenden wenn alle Bestellungen für den ermittelten Tisch hinzugefügt wurden
                    } else {
                        return false; //weiter iterieren wenn Bestellung schon angezeigt wird
                    }
                });
            }
        }
    );
}

let generateOrdersForTable = (data, tischId, toDoArea) => {
    data.bestellungen.forEach(order => { //durch alle Bestellungen iterieren
        if(order.tischId == tischId) { //jede Bestellung mit der zuvor ermittelten TischId
            let newOrder = createNewOrder(order); //Neues Bestellungselement erzeugen
            toDoArea.appendChild(newOrder); //Bestellung der Spalte hinzufügen
        }
    })
}

//Neues Bestellungselement erzeugen
let createNewOrder = (order) => {
    let newOrder = document.createElement("div"); //neues Div für Bestellung erzeugen
    newOrder.id = "drink_" + order.id; //Id vergeben
    newOrder.className = "order_item"; //Klasse zuweisen
    newOrder.setAttribute("onClick", "drinkDone(this.id)"); //OnClick funktion zuweisen
    newOrder.innerHTML = order.getraenkname + " " + order.getraenkgroesse; //Beschriftung zuweisen
    return newOrder;
}

let updateRfidConnection = (connected) => {
    if(connected) {
        document.getElementById("rfid_status").style.backgroundColor = "green";
    } else document.getElementById("rfid_status").style.backgroundColor = "red";
}