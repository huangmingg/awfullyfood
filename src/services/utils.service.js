const isEmptyObject = function (obj) {
    return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object) ? true : false;
}

export {
    isEmptyObject,
}
