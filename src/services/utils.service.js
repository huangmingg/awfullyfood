const isEmptyObject = function (obj) {
  return !!(!obj || (Object.keys(obj).length === 0 && obj.constructor === Object));
};

// Converts the timestamp object from firestore to datestring
const convertTimestamp = function (unixTimestamp) {
  return unixTimestamp ? new Date(unixTimestamp.seconds * 1000).toLocaleDateString() : 'Date Not Found';
};

// Gets currentTimestamp in seconds
const getCurrentTimestamp = function () {
  return (new Date().getTime() / 1000);
};

const sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const comparator = function (nestedKey, reverse) {
  return function (a, b) {
    let destA = a;
    let destB = b;
    nestedKey.forEach((key) => {
      destA = destA[key];
      destB = destB[key];
    });
    if (destA > destB) return (1 * +reverse);
    if (destB > destA) return (-1 * +reverse);
    return 0;
  };
};


export {
  isEmptyObject,
  convertTimestamp,
  getCurrentTimestamp,
  sleep,
  comparator,
};
