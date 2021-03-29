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
        <OrderHistory :orders="orderHistory" :role="'Buyer'"/>
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
import { getUserProfile, getDisplayName } from "@/services/user.service";
import { getTransactionsByBuyer } from "@/services/transaction.service";
import { getListing } from "@/services/list.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import BCategoryChart from "./visualisation/BCategoryChart.vue";
import BApprovedTransactionsCounter from "./visualisation/BApprovedTransactionsCounter.vue";
import BPendingTransactionsCounter from "./visualisation/BPendingTransactionsCounter.vue";
import BPendingOrders from "./visualisation/BPendingOrders.vue";
import OrderHistory from "@/pages/common/visualisation/OrderHistory";


export default {
  name: "BHomePage",
  data() {
    return {
      orderHistory: [],
    };
  },
  components: {
    BCategoryChart,
    BApprovedTransactionsCounter,
    BPendingTransactionsCounter,
    BPendingOrders,
    OrderHistory
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  },

  async mounted() {
    const transactions = (await getTransactionsByBuyer(store.getters.getProfileState?.id, false))
        .filter((ele) => {
          return ele.isApproved === true
        });
    this.orderHistory = await Promise.all(transactions.map(async(transaction) => {
          const listing = await getListing(transaction.listingId);
          const user = await getDisplayName(transaction.buyerId);
          return {
            id: transaction.id,
            item: listing.name,
            quantity: listing.quantity,
            user: user,
            unit: listing.unit,
            date : transaction.completedAt,
          };
    }));
  }
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
