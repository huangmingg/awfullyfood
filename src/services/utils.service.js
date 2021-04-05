const isEmptyObject = function (obj) {
    return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object) ? true : false;
}

const convertTimestamp = function (unixTimestamp) {
    return unixTimestamp ? new Date(unixTimestamp.seconds * 1000).toLocaleDateString() : "Date Not Found";
}

const getCurrentTimestamp = function () {
    return (new Date().getTime() / 1000);
}

const dateDiff = function (a, b) {
    console.log(a, b)
}

export {
    isEmptyObject,
    convertTimestamp,
    dateDiff,
    getCurrentTimestamp
}
