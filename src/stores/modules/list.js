import { filterList, orderList } from '@/services/list.service';
import { comparator } from '@/services/utils.service';

export default {
  state: {
    list: [],
    filteredList: [],
    defaultFilter: {
      itemCategory: ['Ugly', 'Expiring'],
    },
    defaultOrder: [['expiredAt', 'seconds'], 1],
    order: [],
    filter: {},
  },
  getters: {
    getList: (state) => {
      return state.list;
    },

    getFilteredList: (state) => {
      return state.filteredList;
    },

    getFilter: (state) => {
      return state.filter;
    },

    getMostBookmarkedList: (state) => {
      return [...state.list].filter((e) => { return e.bookmarks.length; }).sort(comparator(['bookmarks', 'length'])).slice(0, 5);
    },

    getMostInterestedList: (state) => {
      return [...state.list].filter((e) => { return e.interests.length; }).sort(comparator(['interests', 'length'])).slice(0, 5);
    },
  },
  mutations: {
    updateList(state, list) {
      state.list = list;
    },

    filterList(state) {
      state.filteredList = filterList(state.list, state.filter);
    },

    orderList(state) {
      state.filteredList = orderList(state.filteredList, state.order);
    },

    setFilter(state, filter) {
      state.filter = filter;
    },

    setOrder(state, order) {
      state.order = order;
    },

    resetFilter(state) {
      state.filter = state.defaultFilter;
    },

    resetOrder(state) {
      state.order = state.defaultOrder;
    },
  },
  actions: {
    updateList(context, list) {
      context.commit('updateList', list);
    },

    setFilter(context, filter) {
      context.commit('setFilter', filter);
    },

    setOrder(context, order) {
      context.commit('setOrder', order);
    },

    filterList(context) {
      context.commit('filterList');
    },

    orderList(context) {
      context.commit('orderList');
    },

    resetFilter(context) {
      context.commit('resetFilter');
    },

    resetOrder(context) {
      context.commit('resetOrder');
    },
  },
};
