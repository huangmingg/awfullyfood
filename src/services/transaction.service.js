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

const getTransactionsByListing = async (listingId, saveState = false) => {
    return database.collection("transactions")
        .where("listingId", "==", listingId)
        .get()
        .then(async (res) => {
            const output = await Promise.all(res.docs.map(async(doc) => {
                return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId))
            }));
            saveState ? await store.dispatch('updateTransaction', output) : null;
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}

const approveTransaction = async (transactionId) => {
    return database.collection("transactions").doc(transactionId).update({isApproved:true})
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
}

export {
    getTransactions,
    getTransactionsByBuyer,
    getTransactionsByListing,
    getTransactionsBySeller,
}
