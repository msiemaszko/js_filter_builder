// skrypt php
var php_action = "result.php";

// na podstawie danych localStorage wysyła zapytanie HttpRequest
function sendHttpRequest()
{
    let lista = getStorageList("data_filter");
    let formdata = new FormData();

    // przygotowanie danych formularza POST
    for ( let x in lista ) {
        formdata.append("filtering[]", JSON.stringify({
            "column":   lista[x].column,
            "operator": lista[x].operator,
            "value_1":  lista[x].value_1,
            "value_2":  lista[x].value_2,
        }))
    }

    // dorzuca dane o stronie
    formdata.append("site_current", site_current);

    // obiekt xml-http
    let xmlhttp;
    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest;
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // akcja przy odebraniu danych
    xmlhttp.onreadystatechange = function() {
        if( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {

            // console.log(xmlhttp.responseText);
            // result.innerHTML = xmlhttp.responseText;
            
            let myObj = JSON.parse(xmlhttp.responseText);
            // console.log(myObj);
            result.innerHTML = myObj.html_result;
            site_count = myObj.site_count;
            site_current = myObj.site_current;
            result.innerHTML += `<div>site: ${site_current} / ${site_count}</div>`;
            paginDraw();
        }
    }

    // wysłanie zapytania
    xmlhttp.open("POST", php_action);
    xmlhttp.send(formdata);
}