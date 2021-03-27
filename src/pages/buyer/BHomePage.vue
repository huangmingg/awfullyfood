<template>
  <div class="content">
    Buyer Home Page
    <ul class="chartCardContainer">
      <li>
        <div class="numberCard">
          <b-approved-transactions-counter></b-approved-transactions-counter>
        </div>
      </li>
      <li>
        <div class="numberCard">
          <b-pending-transactions-counter></b-pending-transactions-counter>
        </div>
      </li>
      <li class="orderList">
        <b-order-history></b-order-history>
      </li>
      <li class="orderList">
        <b-pending-orders></b-pending-orders>
      </li>
      <li>
        <b-category-chart></b-category-chart>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import BCategoryChart from "./visualisation/BCategoryChart.vue";
import BApprovedTransactionsCounter from "./visualisation/BApprovedTransactionsCounter.vue";
import BPendingTransactionsCounter from "./visualisation/BPendingTransactionsCounter.vue";
import BOrderHistory from "./visualisation/BOrderHistory.vue";
import BPendingOrders from "./visualisation/BPendingOrders.vue";


export default {
  name: "BHomePage",
  components: {
    BCategoryChart,
    BApprovedTransactionsCounter,
    BPendingTransactionsCounter,
    BOrderHistory,
    BPendingOrders,
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
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
  margin-top: 180px;
}

.orderList {
  overflow:auto;
}
</style>
