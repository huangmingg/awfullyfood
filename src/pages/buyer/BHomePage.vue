<template>
  <div class="content">
    Buyer Home Page
    <ul class="chartCardContainer">
      <li>
        <div class="numberCard">
          <approved-transactions-counter></approved-transactions-counter>
        </div>
      </li>
      <li>
        <div class="numberCard">
          <pending-transactions-counter></pending-transactions-counter>
        </div>
      </li>
      <li>
        <order-history></order-history>
      </li>
      <li>
        <pending-orders></pending-orders>
      </li>
      <li>
        <category-chart></category-chart>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import CategoryChart from "./visualisation/CategoryChart.vue";
import ApprovedTransactionsCounter from "./visualisation/ApprovedTransactionsCounter.vue";
import PendingTransactionsCounter from "./visualisation/PendingTransactionsCounter.vue";
import OrderHistory from "./visualisation/OrderHistory.vue";
import PendingOrders from "./visualisation/PendingOrders.vue";


export default {
  name: "BHomePage",
  components: {
    CategoryChart,
    ApprovedTransactionsCounter,
    PendingTransactionsCounter,
    OrderHistory,
    PendingOrders,
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
}

.numberCard {
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
}
</style>
