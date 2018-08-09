// skrypt php
var phpAction = "result.php";

// na podstawie danych localStorage wysyła zapytanie HttpRequest
function sendHttpRequest()
{
    let list = getStorageList("data_filter");
    let formData = new FormData();

    // przygotowanie danych formularza POST
    for ( let x in list ) {
        formData.append("filtering[]", JSON.stringify({
            "column":   list[x].column,
            "operator": list[x].operator,
            "value_1":  list[x].value_1,
            "value_2":  list[x].value_2,
        }))
    }

    // dorzuca dane o stronie
    if (siteCurrent !== undefined)
        formData.append("site_current", siteCurrent);

    // obiekt xml-http
    let xmlHttp;
    if(window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest;
    } else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // akcja przy odebraniu danych
    xmlHttp.onreadystatechange = function() {
        if( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
            
            let myObj = JSON.parse(xmlHttp.responseText);
            if (myObj != null ) {
                siteCount = myObj.site_count;
                siteCurrent = myObj.site_current;
                if (result) {
                    result.innerHTML = myObj.html_result;
                    result.innerHTML += "<div>site: " + siteCurrent + " / " + siteCount + "</div>";
                }
                paginDraw();
            }
            else 
            if (result) result.innerHTML = "";
        }
    }

    // wysłanie zapytania
    xmlHttp.open("POST", phpAction);
    xmlHttp.send(formData);
}