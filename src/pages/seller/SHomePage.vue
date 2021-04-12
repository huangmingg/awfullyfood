<template>
  <div class="content">
    <ul class="chartCardContainer">
      <li>
        <div class="numberCard">
          <h1>{{ orderHistory.length }}</h1>
          <h5>Number of Completed Orders</h5>
        </div>
      </li>
      <li>
        <div class="numberCard">
          <h1>{{ pendingOrders.length }}</h1>
          <h5>Number of Pending Orders</h5>
        </div>
      </li>
      <li class="orderList">
        <OrderHistory
          :orders="orderHistory"
          :role="'Seller'"
        />
      </li>
      <li class="orderList">
        <PendingOrders
          :orders="pendingOrders"
          :role="'Seller'"
        />
      </li>
      <li>
        <SListingCategoryChart />
      </li>
      <li class="orderList">
        <STopBookmarks :listings="topBookmarks" />
      </li>
      <li class="orderList">
        <STopInterest :listings="topInterests" />
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from '@/services/user.service';
import { getTransactionsBySeller } from '@/services/transaction.service';
import { getListingBySeller } from '@/services/list.service';
import { authService } from '@/firebase';
import { store } from '@/stores';
import OrderHistory from '@/pages/common/visualisation/OrderHistory';
import PendingOrders from '@/pages/common/visualisation/PendingOrders';
import SListingCategoryChart from '@/pages/seller/visualisation/SListingCategoryChart';
import STopBookmarks from './visualisation/STopBookmarks.vue';
import STopInterest from './visualisation/STopInterest.vue';

export default {
  name: 'SHomePage',
  components: {
    SListingCategoryChart,
    STopInterest,
    STopBookmarks,
    OrderHistory,
    PendingOrders,
  },

  computed: {
    orderHistory() {
      return store.getters.getApprovedTransaction;
    },
    pendingOrders() {
      return store.getters.getPendingTransaction;
    },
    topBookmarks() {
      return [...store.getters.getMostBookmarkedList].sort(function(a, b) {
        if (a.bookmarks.length < b.bookmarks.length) return 1;
        if (a.bookmarks.length > b.bookmarks.length) return -1;
        return 0;
      });
    },
    topInterests() {
      return [...store.getters.getMostInterestedList].sort(function(a, b) {
        if (a.interests.length < b.interests.length) return 1;
        if (a.interests.length > b.interests.length) return -1;
        return 0;
      });
    },
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getTransactionsBySeller(store.getters.getProfileId);
    await getListingBySeller(store.getters.getProfileId);
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');
    loader.hide();
  },
};
</script>

<style scoped>

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 0;
  flex-basis: 300px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border: 1px solid #e6e6e6;
  max-height: 500px;
}

.numberCard {
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  margin-bottom: 100px;
}

.orderList {
  overflow: auto;
}
</style>
