import { database } from "@/firebase";
import { store } from "@/stores";

const getTransactions = async (saveState = true) => {
    return database.collection("transactions").get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
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

const getTransactionsBySeller = async (sellerId, saveState = true) => {
    return database.collection("transactions")
        .where("sellerId", "==", sellerId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
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

const getTransactionsByBuyer = async (buyerId, saveState = true) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
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

const getApprovedTransactionsByBuyer = async (buyerId, saveState = true) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .where("isApproved", "==", true)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
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

const getPendingTransactionsByBuyer = async (buyerId, saveState = true) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .where("isApproved", "==", false)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
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

const getTransactionsByListing = async (listingId) => {
    return database.collection("transactions")
        .where("listingId", "==", listingId)
        .get()
        .then(async (res) => {
            const output = res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}



export {
    getTransactions,
    getTransactionsByBuyer,
    getTransactionsByListing,
    getTransactionsBySeller,
    getApprovedTransactionsByBuyer,
    getPendingTransactionsByBuyer,
}
