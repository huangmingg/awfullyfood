// import { authService } from "@/firebase";
// import { router } from "@/routes";
import { database } from "@/firebase";
import {store} from "@/stores";

const getTransactions = async () => {
    return database.collection("transactions").get()
        .then(async(res) => {
            const output =  res.docs.map(doc => {
                return {
                    ...doc.data(),
                    'id': doc.id,
                };
            });
            await store.dispatch('updateTransactions', output);
            return output;
        })
        .catch((error) => {
            console.log(error);
            return [];
        });
}


export {
    getTransactions
}
