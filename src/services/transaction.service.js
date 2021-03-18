import { database } from "@/firebase";

const getTransactions = async () => {
    return database.collection("transactions").get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
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

const getTransactionsBySeller = async (sellerId) => {
    return database.collection("transactions")
        .where("sellerId", "==", sellerId)
        .get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
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

const getTransactionByBuyer = async (buyerId) => {
    return database.collection("transactions")
        .where("buyerId", "==", buyerId)
        .get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
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

const getTransactionByListing = async (listingId) => {
    return database.collection("transactions")
        .where("listingId", "==", listingId)
        .get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
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
    getTransactionByBuyer,
    getTransactionByListing,
    getTransactionsBySeller
}
