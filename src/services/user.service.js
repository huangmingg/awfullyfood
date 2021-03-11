import { database } from "@/firebase";
import { store } from "@/stores";

const isUserRegistered = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.exists;
}

const getUserProfile = (userId) => {
    return database.collection("users").doc(userId).get()
        .then(async(res) => {
            await store.dispatch('updateProfile', res.data());
            return res.data();
        })
        .catch((error) => {
            console.log(error);
            return {};
        })
}

const registerUser = async (userId, metadata) => {
    const body = metadata;
    return database.collection("users").doc(userId).set(body)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        })
}

const updateUser = async (userId, metadata) => {
    const body = metadata
    const res = await database.collection('users').doc(userId).update(body);
    return res;
}

export {
    isUserRegistered,
    getUserProfile,
    registerUser,
    updateUser,
}

