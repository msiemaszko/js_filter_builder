var site_count;
var site_current = getStorageValue("site_current");
var pagination = document.querySelector("#pagination");

function paginDraw() {

    // first - prev
    var paginList = 
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
    let c = Math.min( 5, site_count); // ilosc wyswietlanych bloczkow
    let p = Math.min(Math.max(site_current - ((c-1)/2), 1), site_count - (c-1)); // licz ktory numer wyswietlony jako pierwszy
    for (let i = p; i < p + c; i ++){
        paginList.push(
            { 
                "etykieta" : i,
                "function" : `paginGoto(${i})`
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
    pagination.innerHTML = paginList.map( (i, index) => {
        return `
        <li>
            <a ${( i.etykieta == site_current ) ? "class='active'" : "nie"} onclick="${i.function}">
                ${ (i.etykieta) ? i.etykieta : "<img src='"+i.img+"'/>" }
            </a>
        </li>`;
    }).join('');
}

function paginGoto(no) {
    site_current = no;
    paginChanged();
}
function paginFirst() {
    site_current = 1;
    paginChanged();
}
function paginLast() {
    site_current = site_count;
    paginChanged();
}
function paginNext() {
    if ( site_current < site_count ) site_current++;
    paginChanged();
}
function paginPrev() {
    if ( site_current > 1 ) site_current--;
    paginChanged();
}

function paginChanged()
{
    // zapamiętaj Stronę
    updateStorageValue("site_current", site_current);

    // odswież pagination bar
    paginDraw();

    // wyslij httpRequest
    sendHttpRequest();
}