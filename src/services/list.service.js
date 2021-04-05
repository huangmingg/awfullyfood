import { store } from "@/stores";
import { database } from "@/firebase";
import { downloadFile, uploadFile } from "@/services/storage.service";
import { ListingCreate, ListingRead, ListingUpdate } from "@/models/listing.class";
import { getCurrentTimestamp, comparator } from "@/services/utils.service";

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

const getListingName = async (listingId) => {
    const res = await getListing(listingId);
    return res?.name
}

const orderList = (list, order) => {
    return list.sort(comparator(order[0], order[1]));
}

const filterList = (list, filters) => {
    const _filterListByPropertyInArray = (list, property, array) => {
        if (array && Array.isArray(array)) {
            if (array.length) {
                return list.filter((ele) => {
                    return array.includes(ele[property]);
                });
            } else {
                return [];
            }
        } else {
            return list;
        }
    }
    const buyerId = filters.buyerId;
    const listingId = filters.listingId;
    const sellerId = filters.sellerId;
    const itemCategory = filters.itemCategory;
    const datePosted = filters.datePosted;
    const nameSubstring = filters.nameSubstring;

    list = _filterListByPropertyInArray(list, "buyerId", buyerId);
    list = _filterListByPropertyInArray(list, "sellerId", sellerId);
    list = _filterListByPropertyInArray(list, "listingId", listingId);
    list = _filterListByPropertyInArray(list, "category", itemCategory);

    if (datePosted && +datePosted) {
        list = list.filter((ele) => {
            const result = Math.abs(ele.createdAt.seconds - (Date.now() / 1000));
            return result <= +datePosted;
        });
    }

    if (nameSubstring) {
        list = list.filter((ele) => {
            return ele.name.substr(0, nameSubstring.length).toUpperCase() === nameSubstring.toUpperCase();
        });
    }

    return list;
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
    getListingName,
    orderList,
    filterList,
}

