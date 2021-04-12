import { isEmptyObject } from '@/services/utils.service';

export default {
  state: {
    transaction: [],
  },
  getters: {
    getTransaction: (state) => {
      return state.transaction;
    },

    getApprovedTransaction: (state) => {
      return state.transaction.filter((t) => {
        return t.isApproved;
      });
    },

    getPendingTransaction: (state) => {
      return state.transaction.filter((t) => {
        return !t.isApproved;
      });
    },

    getPendingTransactionForList: (state) => (listingId) => {
      return state.transaction.filter((t) => {
        return !t.isApproved && t.listingId === listingId;
      });
    },

    getBuyerReviewedTransaction: (state) => {
      return state.transaction.filter((t) => {
        return t.isApproved && !isEmptyObject(t.sellerReview);
      });
    },

    getBuyerUnreviewedTransaction: (state) => {
      return state.transaction.filter((t) => {
        return isEmptyObject(t.sellerReview);
      });
    },

    getSellerReviewedTransaction: (state) => {
      return state.transaction.filter((t) => {
        return t.isApproved && !isEmptyObject(t.buyerReview);
      });
    },

    getSellerReviewedTransactionForList: (state) => (listingId) => {
      return state.transaction.filter((t) => {
        return t.isApproved && !isEmptyObject(t.buyerReview) && t.listingId === listingId;
      });
    },
  },
  mutations: {
    updateTransaction(state, transaction) {
      state.transaction = transaction;
    },

  },
  actions: {
    updateTransaction(context, transaction) {
      context.commit('updateTransaction', transaction);
    },
  },
};
