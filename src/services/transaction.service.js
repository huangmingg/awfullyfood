import { database } from '@/firebase';
import { store } from '@/stores';
import { TransactionCreate, TransactionRead, TransactionUpdate } from '@/models/transaction.class';
import { getCurrentTimestamp } from '@/services/utils.service';
import { Review } from '@/models/review.class';
import { getListingName } from '@/services/list.service';

const getTransactions = async (saveState = true) => {
  return database.collection('transactions').get()
    .then(async (res) => {
      const output = await Promise.all(res.docs.map(async (doc) => {
        return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId));
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
        return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId));
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
        return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId));
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
        return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId));
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
        return new TransactionRead(doc.data(), doc.id, await getListingName(doc.data()?.listingId));
      }));
      saveState ? await store.dispatch('updateTransaction', output) : null;
      return output;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

const createTransaction = async (payload) => {
  const transaction = new TransactionCreate(payload);
  return database.collection('transactions').add(transaction)
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

const deleteTransaction = async (transactionId) => {
  const deletePayload = { deletedAt: getCurrentTimestamp() };
  return await updateTransaction(transactionId, deletePayload);
};

const approveTransaction = async (transactionId) => {
  const approvePayload = { isApproved: true };
  return await updateTransaction(transactionId, approvePayload);
};

const updateBuyerReview = async (transactionId, rating, description) => {
  const nowDate = new Date(Date.now());
  const reviewPayload = new Review(rating, description, nowDate.toLocaleDateString());
  return await updateTransaction(transactionId, { buyerReview: { ...reviewPayload } });
};

const updateSellerReview = async (transactionId, rating, description) => {
  const nowDate = new Date(Date.now());
  const reviewPayload = new Review(rating, description, nowDate.toLocaleDateString());
  return await updateTransaction(transactionId, { sellerReview: { ...reviewPayload } });
};

export {
  getTransactions,
  getTransactionsByBuyer,
  getTransactionsByListing,
  getPendingTransactionsBySeller,
  getApprovedTransactionsBySeller,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  approveTransaction,
  updateBuyerReview,
  updateSellerReview,
};

