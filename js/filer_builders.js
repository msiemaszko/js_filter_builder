// var tableRef = document.getElementById('filterTable').getElementsByTagName('tbody')[0];
// var formRef = document.getElementById('filterTable').getElementsByTagName('form')[0];

var tableRef = document.querySelector("#filterTable tbody");
var formRef = document.querySelector("#filterTable form");


confirmFilter = function() {

    // for(i = 0; i < formRef.length; i++) {
        // alert(formRef[i].name + ': ' + formRef[i].value);
    // }
    formRef.submit();
}

// dodaje nowy wiersz do tabeli
addNewRow = function() {
    var rowCount = tableRef.rows.length;
    
    // Insert a row in the table
    var newRow  = tableRef.insertRow(rowCount);

    // cell 0: button delete row
    newCell = newRow.insertCell(0);
    newCell.appendChild( createNewElement("dellButton") );

    // cell 1: select - kolumna
    newCell = newRow.insertCell(1);
    newchild = createNewElement("columnList", selectData);
    newchild.name = "column[]";
    newCell.appendChild( newchild );

    // cell 2 & 3
    newRow.insertCell(2);
    newRow.insertCell(3);
}

// tworzy nowy element typu `type` (text/empty_input/dellButton/columnList/operatorList)
createNewElement = function(type = "text", data = [], operator = ""){
    var inputID, selectID;
    switch(type){

        // button delete
        case "dellButton":
            let del = document.createElement('span');
            del.className = "icon btnDelete";
            del.rodzaj = "btnDelete";
        return del;

        case "empty_input":
            inputID = document.createElement("input");
            inputID.style.display = "none";
            return inputID;

        
        // implie text imput
        case "text":
            inputID = document.createElement("input");
            inputID.type = "text";
            // inputID.name = "wartosc[]";
            return inputID;
        
        // lista kolumn
        case "columnList":
            selectID = document.createElement("select");
            selectID.rodzaj = "column";
            // selectID.name = "column[]";

            // blank option
            blank = document.createElement("OPTION");
            blank.disabled = "disabled";
            blank.selected = "selected";
            blank.text     = " -- wybierz kolumne -- ";
            selectID.appendChild( blank );

            for( let key in data ) {
                var object = data[key];
                let x = document.createElement("OPTION");
                x.value = key;
                x.text = object.text;
                selectID.appendChild( x );
            }
            return selectID;


        // lista dla operatorw: jako data tablica {key: value, key2: value2}
        case "operatorList":
            selectID = document.createElement("select");
            // selectID.name = "operator[]";
            for( let elem in data ) {
                let x = document.createElement("OPTION");
                x.value =  data[elem];
                x.text = operatorsList[ data[elem] ];
                selectID.appendChild( x );
            }
            return selectID; 
        

        // lista dla skrytek: jako data tablica {"key1": [val1, val2], "key2":[...]
        case "skrytkaList":
            selectID = document.createElement("select");
            // selectID.name = "wartosc[]";

            for( let key in data) {
                for ( let value in data[key]) {                        
                    let x = document.createElement("OPTION");
                    x.value =  key;
                    x.text = `${key} / ${data[key][value]}`;
                    selectID.appendChild( x );
                }
            }
            return selectID; 

        
        // lista prosta: jako data tablica ["val1, val2"]
        case "list":
            selectID = document.createElement("select");
            // selectID.name = "wartosc[]";
            for( let elem in data ) {
                let x = document.createElement("OPTION");
                x.value = data[elem];
                x.text = data[elem];
                selectID.appendChild( x );
            }
            return selectID; 
        

        // dla pola typu data
        case "date":
            inputID = document.createElement("input");
            inputID.name = "wartosc[]";
            inputID.type = "date";
            return inputID;
    }
}

// event-delegation: action on change select
changeSelect = function(event) 
{
    if (!event.target.matches('select')) return false;

    let elem = event.target;
    let cell_1th = elem.parentNode.parentNode.cells.item(1);
    let cell_2th = elem.parentNode.parentNode.cells.item(2);
    let cell_3th = elem.parentNode.parentNode.cells.item(3);
    let columnValue = cell_1th.childNodes[0].value;


    switch ( event.target.rodzaj ) 
    {
        // change select with type column
        case "column":
            clearCell(cell_2th);
            newchild = createNewElement( "operatorList",                    selectData[columnValue].operators );
            newchild.rodzaj = "operator";
            newchild.name = "operator[]"; // nazwa inputa w formie
            cell_2th.appendChild(newchild);
            // no-break
            
        // change select with type opertor
        case "operator":
            operatorValue = elem.value;
            clearCell(cell_3th);
            
            // value 1:
            newchild = createNewElement( selectData[columnValue].type,      selectData[columnValue].data );
            newchild.name = "value_1[]"; // nazwa inputa w formie
            cell_3th.appendChild(newchild);
            
            // value 2
            newchild = createNewElement( "empty_input" );

            // jeżeli porównanie typu between twórz jako utwórz normalny input
            if (operatorValue == "btw") {
                newchild = createNewElement( selectData[columnValue].type,  selectData[columnValue].data );
            }

            newchild.name = "value_2[]"; // nazwa inputa w formie
            cell_3th.appendChild(newchild);
        break;

    } // end switch
}

// dla komorki cell usuń wszystkie dzieci
clearCell = function (cell){
    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }
}

// dla podanego elementu kasuje dziadka - wiersz tabeli
deleteTableRow = function(event) {
    if (event.target.rodzaj == "btnDelete") {
        let i = event.target.parentNode.parentNode.rowIndex - 1;
        tableRef.deleteRow(i);
    }
}

// event listenery
tableRef.addEventListener("change", changeSelect);
tableRef.addEventListener("click", deleteTableRow);
window.addEventListener("load", addNewRow);