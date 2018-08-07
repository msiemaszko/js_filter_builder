getStorageValue = function(name) {
    return localStorage.getItem(name) || "";
}

updateStorageValue = function(name, value) {
    localStorage.setItem(name, value);
}

getStorageList = function(name) {
    return JSON.parse(localStorage.getItem(name)) || [];
}

updateStorageList = function(name, array) {
    localStorage.setItem(name, JSON.stringify(array));
}