import { database } from "@/firebase";

const isUserRegistered = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.exists;
}

const checkUserRole = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.data().role;
}

const registerUser = async (userId, metadata) => {
    const body = metadata;
    const res = await database.collection("users").doc(userId).set(body);
    return res;
}

const updateUser = async (userId, metadata) => {
    const body = metadata
    const res = await database.collection('users').doc(userId).update(body);
    return res;
}

export {
    isUserRegistered,
    checkUserRole,
    registerUser,
    updateUser,
}

