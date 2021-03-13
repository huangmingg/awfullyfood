export default {
    state: {
        list: [],
    },
    getters: {
        getList: state => {
            return state.list;
        },
    },
    mutations: {
        updateList (state, list) {
            state.list = list;
        }
    },
    actions: {
        updateList (context, list) {
            context.commit('updateList', list);
        },
    }
}
