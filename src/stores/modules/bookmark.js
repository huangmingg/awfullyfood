export default {
    state: {
        bookmarks: [],
    },
    getters: {
        getBookmarks: state => {
            return state.bookmarks;
        },
    },
    mutations: {
        updateBookmarks (state, bookmarks) {
            state.bookmarks = bookmarks;
        }

    },
    actions: {
        updateBookmarks (context, bookmarks) {
            context.commit('updateBookmarks', bookmarks);
        },

        clearProfile (context) {
            context.commit('updateBookmarks', []);
        }

    }
}
