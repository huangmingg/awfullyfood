<template>
  <div class="content">
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
        <OrderHistory :orders="orderHistory" :role="'Seller'"/>
      </li>
      <li class="orderList">
        <s-pending-orders></s-pending-orders>
      </li>
      <li>
        <s-listing-category-chart></s-listing-category-chart>
      </li>
      <li class="orderList">
        <s-top-likes></s-top-likes>
      </li>
      <li class="orderList">
        <s-top-interest></s-top-interest>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile, getDisplayName } from "@/services/user.service";
import { getTransactionsBySeller } from "@/services/transaction.service";
import { getListing } from "@/services/list.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import SListingCategoryChart from "./visualisation/SListingCategoryChart.vue";
import SApprovedTransactionsCounter from "./visualisation/SApprovedTransactionsCounter.vue";
import SPendingTransactionsCounter from "./visualisation/SPendingTransactionsCounter.vue";
import SPendingOrders from "./visualisation/SPendingOrders.vue";
import STopLikes from "./visualisation/STopLikes.vue";
import STopInterest from "./visualisation/STopInterest.vue";
import OrderHistory from "@/pages/common/visualisation/OrderHistory";
export default {
  name: "SHomePage",
  data() {
    return {
      orderHistory: [],
    };
  },
  components: {
    SListingCategoryChart,
    SApprovedTransactionsCounter,
    SPendingTransactionsCounter,
    SPendingOrders,
    STopInterest,
    STopLikes,
    OrderHistory,
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  },

  async mounted() {
    const transactions = (await getTransactionsBySeller(store.getters.getProfileState?.id, false))
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
  overflow: auto;
}
</style>
