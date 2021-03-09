import { database } from "@/firebase";
import { store } from "@/stores";

const isUserRegistered = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.exists;
}

const getUserRole = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    const role = res.data()?.role;
    await store.dispatch('updateRole', role);
    return role;
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
    getUserRole,
    registerUser,
    updateUser,
}

