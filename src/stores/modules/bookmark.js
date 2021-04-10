export default {
  state: {
    bookmarks: [],
    bookmarkLists: [],
  },
  getters: {
    getBookmarks: (state) => {
      return state.bookmarks;
    },
    getBookmarkLists: (state) => {
      return state.bookmarkLists;
    },
  },
  mutations: {
    updateBookmarks(state, bookmarks) {
      state.bookmarks = bookmarks;
    },

    updateBookmarkLists(state, lists) {
      state.bookmarkLists = lists;
    },

  },
  actions: {
    updateBookmarks(context, bookmarks) {
      context.commit('updateBookmarks', bookmarks);
    },
    updateBookmarkLists(context, lists) {
      context.commit('updateBookmarkLists', lists);
    },
    clearBookmarks(context) {
      context.commit('updateBookmarks', []);
    },
    clearBookmarkLists(context) {
      context.commit('updateBookmarkLists', []);
    },
  },
};
