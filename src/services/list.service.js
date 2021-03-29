import { store } from "@/stores";
import { database } from "@/firebase";

const getListings = async (saveState = true) => {
    return database.collection("listings").get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const getListingBySeller = async (sellerId, saveState = true) => {
    return database.collection("listings")
        .where("sellerId", "==", sellerId)
        .get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return {};
        });
}

const getListing = async (listingId) => {
    return database.collection("listings")
        .doc(listingId)
        .get()
        .then((res) => {
            return res.data();
        })
        .catch((error) => {
            console.log(error);
            return {};
        });
}

const createListing = async (payload) => {
    console.log(payload)
}

const updateListing = async (listingId, payload) => {
    return database.collection("listings").doc(listingId).update(payload)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const deleteListing = async (listingId) => {
    console.log(listingId)
}

const uploadListingPhotos = async(listingId, photos) => {
    console.log(listingId, photos)
}

export {
    getListings,
    getListingBySeller,
    getListing,
    createListing,
    updateListing,
    deleteListing,
    uploadListingPhotos,
}

