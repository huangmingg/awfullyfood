import { firestore } from '@/firebase';

const isEmptyObject = function (obj) {
  return !!(!obj || (Object.keys(obj).length === 0 && obj.constructor === Object));
};

// Convert the firestore timestamp to date object
const convertTimestamp = function (firestoreTimestamp, toString= true) {
  return toString ? firestoreTimestamp.toDate().toLocaleDateString() : firestoreTimestamp.toDate();
};

// Convert date object to firestore timestamp
const convertDateObject = function (dateObject) {
  return firestore.Timestamp(Math.trunc(dateObject.getTime() / 1000), dateObject.getTime() % 1000);
};

// Convert date string to firestore timestamp
const convertDateString = function (dateString) {
  return firestore.Timestamp(Math.trunc(Date.parse(dateString) / 1000), Date.parse(dateString) % 1000);
};

// Get current firestore timestamp representation
const getCurrentTimestamp = function () {
  return firestore.Timestamp.now();
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
  convertDateObject,
  convertDateString,
  getCurrentTimestamp,
  sleep,
  comparator,
};
