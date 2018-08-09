let siteCount;
let siteCurrent = getStorageValue("site_current");
let pagination = document.querySelector("#pagination");

function paginDraw() {

    if (pagination == null || siteCount == 0) return;

    // first - prev
    let paginList = 
    [
        {
            "img" : "static/img/page-first.gif",
            "function" : "paginFirst()"
        },
        {
            "img" : "static/img/page-prev.gif",
            "function" : "paginPrev()"
        }
    ];

    // bloczki z cyferkami xd
    let c = Math.min( 5, siteCount); // ilosc wyswietlanych bloczkow
    let p = Math.min(Math.max(siteCurrent - ((c-1)/2), 1), siteCount - (c-1)); // licz ktory numer wyswietlony jako pierwszy
    for (let i = p; i < p + c; i ++){
        paginList.push(
            { 
                "etykieta" : i,
                "function" : "paginGoto(" + i + ")"
            }
        );
    }

    // next - last
    paginList.push({ 
            "img" : "static/img/page-next.gif",
            "function" : "paginNext()"
        });
    paginList.push({ 
            "img" : "static/img/page-last.gif",
            "function" : "paginLast()"
        });
    
    // rysuj wszystkie bloczki
    pagination.innerHTML = paginList.map( function(i, index) {
        return "<li>"+
            "<a " + (( i.etykieta == siteCurrent ) ? "class='active'" : "nie" ) + " onclick='" + i.function + "'>" + 
                ((i.etykieta) ? i.etykieta : "<img src='"+i.img+"'/>" ) + 
            "</a>" + 
        "</li>";
    }).join('');
}

function paginGoto(no) {
    siteCurrent = no;
    paginChanged();
}
function paginFirst() {
    siteCurrent = 1;
    paginChanged();
}
function paginLast() {
    siteCurrent = siteCount;
    paginChanged();
}
function paginNext() {
    if ( siteCurrent < siteCount ) siteCurrent++;
    paginChanged();
}
function paginPrev() {
    if ( siteCurrent > 1 ) siteCurrent--;
    paginChanged();
}

function paginChanged()
{
    // zapamiętaj Stronę
    updateStorageValue("site_current", siteCurrent);

    // odswież pagination bar
    paginDraw();

    // wyslij httpRequest
    sendHttpRequest();
}