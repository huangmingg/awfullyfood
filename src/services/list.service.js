import { store } from "@/stores";
import { database } from "@/firebase";
import { downloadFile, uploadFile } from "@/services/storage.service";
import { ListingCreate, ListingRead, ListingUpdate } from "@/models/listing.class";
import { getCurrentTimestamp } from "@/services/utils.service";

const getListings = async (saveState = true) => {
    return database.collection("listings").get()
        .then(async(res) => {
            const output = await Promise.all(res.docs.map(async(doc) => {
                return new ListingRead(doc.data(), doc.id, await getListingPhoto(doc.id))
            }));
            saveState ? await store.dispatch('updateList', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
};

const getListingBySeller = async (sellerId, saveState = true) => {
    return database.collection("listings")
        .where("sellerId", "==", sellerId)
        .get()
        .then(async(res) => {
            const output = await Promise.all(res.docs.map(async(doc) => {
                return new ListingRead(doc.data(), doc.id, await getListingPhoto(doc.id))
            }));
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
        .then(async(res) => {
            return new ListingRead(res.data(), res.id, await getListingPhoto(res.id));
        })
        .catch((error) => {
            console.log(error);
            return {};
        });
}

const createListing = async (payload) => {
    const listing = new ListingCreate(payload);
    return database.collection("listings").add(listing)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const updateListing = async (listingId, payload) => {
    const listing = new ListingUpdate(payload);
    return database.collection("listings").doc(listingId).update(listing)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

const deleteListing = async (listingId) => {
    const deletePayload = { 'deletedAt' : getCurrentTimestamp() };
    return await updateListing(listingId, deletePayload);
}

const updateListingPhoto = async(listingId, file) => {
    return uploadFile(file, `listings/${listingId}`);
}

const getListingPhoto = async (listingId) => {
    const res = await downloadFile(`listings/${listingId}`);
    return res ? res : downloadFile('listings/dummy.png');
}


export {
    getListings,
    getListingBySeller,
    getListing,
    createListing,
    updateListing,
    deleteListing,
    updateListingPhoto,
    getListingPhoto,
}

