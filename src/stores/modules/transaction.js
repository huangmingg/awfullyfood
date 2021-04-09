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
