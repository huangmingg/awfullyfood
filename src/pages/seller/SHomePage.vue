<template>
  <div class="content">
    Seller Home Page
    <ul class="chartCardContainer">
      <li>
        <div class="numberCard">
          <s-approved-transactions-counter></s-approved-transactions-counter>
        </div>
      </li>
      <li>
        <div class="numberCard">
          <s-pending-transactions-counter></s-pending-transactions-counter>
        </div>
      </li>
      <li class="orderList">
        <s-order-history></s-order-history>
      </li>
      <li class="orderList">
        <s-pending-orders></s-pending-orders>
      </li>
      <li>
        <s-listing-category-chart></s-listing-category-chart>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import SListingCategoryChart from "./visualisation/SListingCategoryChart.vue";
import SApprovedTransactionsCounter from "./visualisation/SApprovedTransactionsCounter.vue";
import SPendingTransactionsCounter from "./visualisation/SPendingTransactionsCounter.vue";
import SOrderHistory from "./visualisation/SOrderHistory.vue";
import SPendingOrders from "./visualisation/SPendingOrders.vue";


export default {
  name: "SHomePage",
  components: {
    SListingCategoryChart,
    SApprovedTransactionsCounter,
    SPendingTransactionsCounter,
    SOrderHistory,
    SPendingOrders,
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
