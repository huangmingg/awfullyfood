export default {
    state: {
        profile: {},
    },
    getters: {
        getRole: state => {
            return state.profile?.role;
        },
        getName: state => {
            return state.profile?.name;
        },
        getProfileState: state => {
            return state.profile;
        },
        getProfileId: state => {
            return state.profile?.id;
        }
    },
    mutations: {
        updateProfile (state, profile) {
            state.profile = profile;
        }

    },
    actions: {
        updateProfile (context, profile) {
            context.commit('updateProfile', profile);
        },

        clearProfile (context) {
            context.commit('updateProfile', {});
        }

    }
}
