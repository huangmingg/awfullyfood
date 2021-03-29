import { database } from "@/firebase";
import { store } from "@/stores";
import { uploadFile, downloadFile, deleteFile } from "@/services/storage.service";

const isUserRegistered = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.exists;
}

const getUserProfile = (userId, saveState= true) => {
    return database.collection("users").doc(userId).get()
        .then(async(res) => {
            if (!res.data()) {
                return {};
            } else {
                const profile = { ...res.data(), 'id': res.id };
                saveState ? await store.dispatch('updateProfile', profile) : null;
                return profile;
            }
        })
        .catch((error) => {
            console.log(error);
            return {};
        });
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
        });
}

const updateUser = async (userId, metadata) => {
    const body = {
        name: metadata['name'],
        email: metadata['email'],
        phoneNumber: metadata['phoneNumber'],
        role: metadata['role'],
        address: metadata['address']
    };
    return database.collection("users").doc(userId).update(body)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const getDisplayPhoto = async (userId) => {
    const res = await downloadFile(`users/${userId}`);
    return res ? res : downloadFile('users/dummy.png');
}

const updateDisplayPhoto = async (userId, file) => {
    return uploadFile(file, `users/${userId}`);
}

const deleteDisplayPhoto = async (userId) => {
    return deleteFile(`users/${userId}`);
}

const getDisplayName = async function(userId) {
    const res = await getUserProfile(userId, false);
    return res?.name;
}


export {
    isUserRegistered,
    getUserProfile,
    registerUser,
    updateUser,
    getDisplayPhoto,
    updateDisplayPhoto,
    deleteDisplayPhoto,
    getDisplayName,
}

