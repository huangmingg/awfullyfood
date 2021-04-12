import { database, firestore } from '@/firebase';
import { store } from '@/stores';
import { TransactionCreate, TransactionRead, TransactionUpdate } from '@/models/transaction.class';
import { getCurrentTimestamp } from '@/services/utils.service';
import { getListingName, getListing, updateListing } from '@/services/list.service';
import { getDisplayName } from '@/services/user.service';

const getTransactions = async (saveState = true) => {
  return database.collection('transactions').get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getPendingTransactionsBySeller = async (sellerId, listingId, saveState = true) => {
  return database.collection('transactions')
    .where('sellerId', '==', sellerId)
    .where('listingId', '==', listingId)
    .where('isApproved', '==', false)
    .get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getApprovedTransactionsBySeller = async (sellerId, listingId, saveState = true) => {
  return database.collection('transactions')
    .where('sellerId', '==', sellerId)
    .where('listingId', '==', listingId)
    .where('isApproved', '==', true)
    .get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getTransactionsByBuyer = async (buyerId, saveState = true) => {
  return database.collection('transactions')
    .where('buyerId', '==', buyerId)
    .get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getTransactionsBySeller = async (sellerId, saveState = true) => {
  return database.collection('transactions')
    .where('sellerId', '==', sellerId)
    .get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const getTransactionsByListing = async (listingId, saveState = false) => {
  return database.collection('transactions')
    .where('listingId', '==', listingId)
    .get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(
          doc.data(),
          doc.id,
          await getListingName(doc.data()?.listingId),
          await getDisplayName(doc.data()?.buyerId),
          await getDisplayName(doc.data()?.sellerId),
        );
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const createInterest = async (listingId, buyerId) => {
  const payload = { buyerId, updatedAt: getCurrentTimestamp() };
  const interests = firestore.FieldValue.arrayUnion(payload);
  return database.collection('listings').doc(listingId).update(
    {
      interests,
    }
  )
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const createTransaction = async (payload) => {
  const updateListing = await createInterest(payload.listingId, payload.buyerId);
  if (!updateListing) {
    console.log('Something went wrong while updating listing with buyer interest');
    return false;
  }
  const transaction = new TransactionCreate(payload);
  return database.collection('transactions').add({ ...transaction })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const updateTransaction = async (transactionId, payload) => {
  const transaction = new TransactionUpdate(payload);
  return database.collection('transactions').doc(transactionId).update({ ...transaction })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getTransaction = async (transactionId) => {
  return database.collection('transactions')
    .doc(transactionId)
    .get()
    .then(async (res) => {
      return new TransactionRead(
        res.data(),
        res.id,
        await getListingName(res.data()?.listingId),
        await getDisplayName(res.data()?.buyerId),
        await getDisplayName(res.data()?.sellerId)
      );
    })
    .catch((error) => {
      console.log(error);
      return {};
    });
};

const deleteTransaction = async (transactionId) => {
  const deletePayload = { deletedAt: getCurrentTimestamp() };
  return await updateTransaction(transactionId, deletePayload);
};

const approveTransaction = async (transactionId) => {
  const transaction = await getTransaction(transactionId);
  const listing = await getListing(transaction.listingId);
  if (!transaction || !listing) {
    console.log('Error in fetching transaction or listing');
    return false;
  }
  const transactionQuantity = transaction.quantity;
  const listingQuantity = listing.quantity;
  if (transactionQuantity > listingQuantity) {
    console.log('Transaction quantity is more than listing quantity!');
    return false;
  }
  const updateListRes = await updateListing(transaction.listingId, { quantity: +listingQuantity - +transactionQuantity });
  const approvePayload = { isApproved: true, completedAt: getCurrentTimestamp() };
  return updateListRes ? await updateTransaction(transactionId, approvePayload) : false;
};

export {
  getTransaction,
  getTransactions,
  getTransactionsByBuyer,
  getTransactionsByListing,
  getPendingTransactionsBySeller,
  getApprovedTransactionsBySeller,
  getTransactionsBySeller,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  approveTransaction,
  createInterest,
};

