import { store } from "@/stores";
import {database} from "@/firebase";

const getListings = async () => {
    return database.collection("listings").get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            await store.dispatch('updateList', output);
            return output;
        })
        .catch((error) => {
            console.log(error);
            return {};
        });
}

const getListingBySeller = async (sellerId) => {
    console.log(sellerId)
}

const getListing = async (listingId) => {
    console.log(listingId)
}

const createListing = async (payload) => {
    console.log(payload)
}

const updateListing = async (listingId, payload) => {
    console.log(listingId, payload)
}

const deleteListing = async (listingId) => {
    console.log(listingId)
}

export {
    getListings,
    getListingBySeller,
    getListing,
    createListing,
    updateListing,
    deleteListing
}

