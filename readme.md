## JS Filter Builder
----
HTML / JS / ajax Dynamic filter generator. The script generates dynamic inputs, which data can be sent via POST (XMLHttpRequest) to any php script. The results are collected in real time. The filtering criteria are stored in the browser's LocalStorage. Pagination engine allow send extra info about current page and ammount of subsites.

<p align="center">
  <img src="screenshot.png">
</p>


#### input data :
```js
// values for the column `skrytka`
datalist_skrytki = {
    "domyslny": [
        "Wysłane",
        "Odebrane"
    ],
    "egzadm": [
        "Wysłane",
        "Odebrane"
    ]
};

// values for the column `typ`
datalist_typ = [
    "TW-1",
    "ADN",
    "Pismo Ogóle"
];

// definition of operators
var operatorsList = {
    "gt"  : ">",
    "le"  : "<",
    "eq"  : "=",
    "btw" : "between",
    "lke" : "like"
};

// definition of columns, allowed operators and value types
var selectData = {
    "skrytka" : {
        "text"      : "Skrytka",
        "type"      : "skrytkaList",
        "operators" : ["eq"],
        "data"      : datalist_skrytki
    },
    "send_date" : {
        "text"      : "Data wysyłki",
        "type"      : "date",
        "operators" : ["eq", "gt", "le", "btw"]
    },
    "typ": {
        "text"      : "Typ pisma",
        "type"      : "list",
        "operators" : ["eq", "lke"],
        "data"      : datalist_typ
    },
    "tytul": {
        "text"  : "Tytuł",
        "type"  : "text",
        "operators" : ["eq", "lke"]
    }
};
```

#### obtained POST data : 
```php
Array
(
    [filtering] => Array
        (
            [0] => {
                "column"    : "skrytka",
                "operator"  : "eq",
                "value_1"   : "domyslny",
                "value_2"   : ""
                }
            [1] => {
                "column"    : "send_date",
                "operator"  : "btw",
                "value_1"   : "2018-07-02",
                "value_2"   : "2018-08-31"}
            [2] => {
                "column"    : "tytul",
                "operator"  : "lke",
                "value_1"   : "pozdrowienia",
                "value_2"   : ""
                }
        )

    [site_current] => 1
)
```