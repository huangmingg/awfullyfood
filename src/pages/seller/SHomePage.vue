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
        <OrderHistory :orders="orderHistory" :role="'Seller'" />
      </li>
      <li class="orderList">
        <PendingOrders :orders="pendingOrders" :role="'Seller'" />
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
import STopLikes from "./visualisation/STopLikes.vue";
import STopInterest from "./visualisation/STopInterest.vue";
import OrderHistory from "@/pages/common/visualisation/OrderHistory";
import PendingOrders from "@/pages/common/visualisation/PendingOrders";

export default {
  name: "SHomePage",
  data() {
    return {
      orderHistory: [],
      pendingOrders: [],
    };
  },
  components: {
    SListingCategoryChart,
    SApprovedTransactionsCounter,
    SPendingTransactionsCounter,
    STopInterest,
    STopLikes,
    OrderHistory,
    PendingOrders,
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  },

  async mounted() {
    const transactions = (
      await getTransactionsBySeller(store.getters.getProfileState?.id, false)
    ).filter((ele) => {
      return ele.isApproved === true;
    });
    this.orderHistory = await Promise.all(
      transactions.map(async (transaction) => {
        const listing = await getListing(transaction.listingId);
        const user = await getDisplayName(transaction.buyerId);
        return {
          id: transaction.id,
          item: listing.name,
          quantity: listing.quantity,
          user: user,
          unit: listing.unit,
          date: transaction.completedAt,
        };
      })
    );
    const pendings = (
      await getTransactionsBySeller(store.getters.getProfileState?.id, false)
    ).filter((ele) => {
      return ele.isApproved === false;
    });
    this.pendingOrders = await Promise.all(
      pendings.map(async (pending) => {
        const pendingListing = await getListing(pending.listingId);
        const pendingUser = await getDisplayName(pending.buyerId);
        return {
          id: pending.id,
          item: pendingListing.name,
          quantity: pendingListing.quantity,
          user: pendingUser,
          unit: pendingListing.unit,
          date: pending.createdAt,
        };
      })
    );
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
  overflow: auto;
}
</style>
