import { database } from "@/firebase";
import { store } from "@/stores";
import { storage } from "@/firebase";

const isUserRegistered = async (userId) => {
    const res = await database.collection("users").doc(userId).get();
    return res.exists;
}

const getUserProfile = (userId) => {
    return database.collection("users").doc(userId).get()
        .then(async(res) => {
            const profile = { ...res.data(), 'id': res.id };
            await store.dispatch('updateProfile', profile);
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
        });
}

const updateUser = async (userId, metadata) => {
    const body = metadata
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
    const endpointRef = storage.ref().child(`users/${userId}/displayPhoto`);
    return endpointRef.getDownloadURL()
        .then((url) => {
            return url
        })
        .catch((error) => {
            console.log(error)
            return false;
        });
}

const updateDisplayPhoto = async (userId, file) => {
    const endpointRef = storage.ref().child(`users/${userId}/displayPhoto`);
    return endpointRef.put(file)
        .then(() => {
            return true
        })
        .catch(() => {
            return false;
        });
}

const deleteDisplayPhoto = async (userId) => {
    const endpointRef = storage.ref().child(`users/${userId}/displayPhoto`);
    return endpointRef.delete()
        .then(() => {
            return true
        })
        .catch(() => {
            return false;
        });
}

export {
    isUserRegistered,
    getUserProfile,
    registerUser,
    updateUser,
    getDisplayPhoto,
    updateDisplayPhoto,
    deleteDisplayPhoto
}

