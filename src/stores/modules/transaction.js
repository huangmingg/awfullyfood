export default {
    state: {
        transaction: [],
    },
    getters: {
        getTransaction: state => {
            return state.transaction;
        },
    },
    mutations: {
        updateTransaction (state, transaction) {
            state.transaction = transaction;
        }

    },
    actions: {
        updateTransaction (context, transaction) {
            context.commit('updateTransaction', transaction);
        },
    }
}
