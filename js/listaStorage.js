getStorage = function(name) {
    return JSON.parse(localStorage.getItem(name)) || [];
}

updateStorage = function(name, lista) {
    localStorage.setItem(name, JSON.stringify(lista));
}