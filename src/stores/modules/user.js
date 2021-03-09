export default {
    namespaced: true,
    state: {
        role: ""
    },
    getters: {
        getRole: state => {
            return state.role;
        }
    },
    mutations: {
        updateRole (state, role) {
            state.role = role;
        }
    },
    actions: {
        updateRole (context, role) {
            context.commit('updateRole', role);
        }
    }
}
