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
          :role="'Buyer'"
        />
      </li>
      <li class="orderList">
        <PendingOrders
          :orders="pendingOrders"
          :role="'Buyer'"
        />
      </li>
      <li>
        <BCategoryChart />
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from '@/services/user.service';
import { getTransactionsByBuyer } from '@/services/transaction.service';
import { authService } from '@/firebase';
import { store } from '@/stores';
import OrderHistory from '@/pages/common/visualisation/OrderHistory';
import PendingOrders from '@/pages/common/visualisation/PendingOrders';
import BCategoryChart from './visualisation/BCategoryChart.vue';

export default {
  name: 'BHomePage',
  components: {
    BCategoryChart,
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
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getTransactionsByBuyer(store.getters.getProfileId);
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
