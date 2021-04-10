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
