let tableRef = document.querySelector("#filterTable tbody");
let result = document.querySelector("#result");

// wczytuje informacje z localStorage, tworzy tabele oraz wysyła zapytanie http
function tableConstructor() {
    let list = getStorageList("data_filter");
    if ( list.length > 0) {
        for ( let x in list ) {
            addNewRow(null, list[x]);
        }
    }
    else addNewRow();
    sendHttpRequest();
}

// obsługa przycisku `zatwierdz` - generuje tablice wartości, aktualizuje localStorage i wysyła httpRequest
function confirmFiltration() {
    
    let tableRef = document.querySelectorAll("#filterTable tbody tr");
    let tmpArray = [];

    // dla każdego wiersza w tabeli
    for ( let i = 0; i < tableRef.length; i++ ) 
    {
        // skip empty inputs
        if ( tableRef[i].childNodes[1].childNodes[0].value == "-- wybierz kolumne --" ) continue;
        if ( tableRef[i].childNodes[3].childNodes[0].value == "" ) continue;

        let dataObject = {
            "column"    : tableRef[i].childNodes[1].childNodes[0].value,
            "operator"  : tableRef[i].childNodes[2].childNodes[0] !== undefined ? tableRef[i].childNodes[2].childNodes[0].value : "",
            "value_1"   : tableRef[i].childNodes[3].childNodes[0] !== undefined ? tableRef[i].childNodes[3].childNodes[0].value : "",
            "value_2"   : tableRef[i].childNodes[3].childNodes[1] !== undefined ? tableRef[i].childNodes[3].childNodes[1].value : ""
        }
        tmpArray.push( dataObject );
    }

    // zaktualizuj localStorage
    updateStorageList("data_filter", tmpArray);
    paginGoto(1);
    sendHttpRequest();
}

// dodaje nowy wiersz do tabeli
function addNewRow( event, dataObject ) 
{
    let newCell, newchild;
    let rowCount = tableRef.rows.length;
    
    // Insert a row in the table
    var newRow  = tableRef.insertRow(rowCount);

    // cell 0: button delete row
    deleteCell = newRow.insertCell(0);
    deleteCell.appendChild( createNewElement("dellButton") );
    
    // celll 1: column option
    columnCell = newRow.insertCell(1);
    columnList = createNewElement("columnList", selectData);
    columnCell.appendChild( columnList );

    // cell 2 && 3
    operatCell = newRow.insertCell(2);
    valueCell = newRow.insertCell(3);

    // w przypadku gdy oddtwarzam tabele z localStorage 
    if (dataObject !== undefined ) 
    {
        columnValue   = dataObject.column;
        operatorValue = dataObject.operator;
        valueValue_1  = dataObject.value_1;
        valueValue_2  = dataObject.value_2;

        // cell 1: select - kolumna
        columnList.value = columnValue;
        columnCell.appendChild( columnList );
        
        // cell 2: operator list
        operatorList = createNewOperatorList(columnValue, operatorValue);
        operatCell.appendChild( operatorList );
        
        // cell 3
        createNewValueFields(valueCell, selectData[columnValue].type, selectData[columnValue].data, operatorValue, valueValue_1, valueValue_2 );
    }
}

// tworzy nowy element typu `type` (text/empty_input/dellButton/columnList/operatorList)
function createNewElement(type, data){
    let inputID, selectID;
    data = data || [];


    switch(type) {

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
            inputID.setAttribute("type", "text");
            inputID.setAttribute('list', data); // list -> datalist
            return inputID;
        
        // lista kolumn
        case "columnList":
            selectID = document.createElement("select");
            selectID.rodzaj = "column";

            // blank option
            let blank = document.createElement("OPTION");
            blank.disabled = "disabled";
            blank.selected = "selected";
            blank.text     = " -- wybierz kolumne -- ";
            selectID.appendChild( blank );

            for( let key in data ) {
                let object = data[key];
                let option = document.createElement("OPTION");
                option.value = key;
                option.text = object.text;
                selectID.appendChild( option );
            }
            return selectID;


        // lista dla operatorw: jako data tablica {key: value, key2: value2}
        case "operatorList":
            selectID = document.createElement("select");
            for( let elem in data ) {
                let option = document.createElement("OPTION");
                option.value =  data[elem];
                option.text = operatorsList[ data[elem] ];
                selectID.appendChild( option );
            }
            return selectID;
        

        // lista dla skrytek: jako data tablica {"key1": [val1, val2], "key2":[...]
        case "skrytkaList":
            selectID = document.createElement("select");

            for( let key in data) {
                for ( let value in data[key]) {                        
                    let option = document.createElement("OPTION");
                    option.value = key + '/'+ data[key][value];
                    option.text = key + '/'+ data[key][value];
                    selectID.appendChild( option );
                }
            }
            return selectID; 

        
        // lista prosta: jako data tablica ["val1, val2"]
        case "list":
            selectID = document.createElement("select");
            for( let elem in data ) {
                let option = document.createElement("OPTION");
                option.value = data[elem];
                option.text = data[elem];
                selectID.appendChild( option );
            }
            return selectID; 
        

        // dla pola typu data
        case "date":
            inputID = document.createElement("input");
            inputID.setAttribute("type", "date");
            return inputID;
    }
}

// tworzy liste dla typu operator
function createNewOperatorList(columnValue, value) {
    let newchild = createNewElement( "operatorList",                selectData[columnValue].operators );
    if (value !== undefined) newchild.value = value;
    newchild.rodzaj = "operator";
    return newchild;
}

// tworzy inputy dla wartości
function createNewValueFields(cell, type, data, operatorValue, valueValue_1, valueValue_2) {
    let newchild;

    // value 1:
    newchild = createNewElement( type, data );
    if (valueValue_1 !== undefined) newchild.value = valueValue_1;
    cell.appendChild(newchild);

    // value 2:
        // jeżeli porównanie typu between twórz jako utwórz normalny input
        if (operatorValue == "btw") {
            newchild = createNewElement( type, data );
        } 
        else 
            newchild = createNewElement( "empty_input" );
    if (valueValue_2 !== undefined) newchild.value = valueValue_2;
    cell.appendChild(newchild);
}

// event-delegation: action on change select
function selectOnChange(event) 
{
    var newChild;
    if (!event.target == 'select') return false;

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
            newChild = createNewOperatorList(columnValue);
            cell_2th.appendChild(newChild);
            // no-break
            
        // change select with type opertor
        case "operator":
            var operatorValue = elem.value;
            clearCell(cell_3th);
            
            // value fields:
            createNewValueFields(cell_3th, selectData[columnValue].type, selectData[columnValue].data, operatorValue )
        break;

    } // end switch
}


// dla komorki cell usuń wszystkie dzieci
function clearCell(cell){
    while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
    }
}

// dla podanego elementu kasuje dziadka - wiersz tabeli
function deleteTableRow (event) {
    if (event.target.rodzaj == "btnDelete") {
        let i = event.target.parentNode.parentNode.rowIndex - 1;
        tableRef.deleteRow(i);
    }
}

// event listenery
tableRef.addEventListener("change", selectOnChange);
tableRef.addEventListener("click", deleteTableRow);
document.querySelector(".btnAddRow").addEventListener("click", addNewRow);
document.querySelector(".btnAccept").addEventListener("click", confirmFiltration);
window.addEventListener("load", tableConstructor);