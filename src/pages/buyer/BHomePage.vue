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
        <OrderHistory :orders="orderHistory" :role="'Buyer'" />
      </li>
      <li class="orderList">
        <PendingOrders :orders="pendingOrders" :role="'Buyer'" />
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
import OrderHistory from "@/pages/common/visualisation/OrderHistory";
import PendingOrders from "@/pages/common/visualisation/PendingOrders";

export default {
  name: "BHomePage",
  data() {
    return {
      orderHistory: [],
      pendingOrders: [],
    };
  },
  components: {
    BCategoryChart,
    BApprovedTransactionsCounter,
    BPendingTransactionsCounter,
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
      await getTransactionsByBuyer(store.getters.getProfileState?.id, false)
    ).filter((ele) => {
      return ele.isApproved === true;
    });
    this.orderHistory = await Promise.all(
      transactions.map(async (transaction) => {
        const listing = await getListing(transaction.listingId);
        const user = await getDisplayName(transaction.sellerId);
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
      await getTransactionsByBuyer(store.getters.getProfileState?.id, false)
    ).filter((ele) => {
      return ele.isApproved === false;
    });
    this.pendingOrders = await Promise.all(
      pendings.map(async (pending) => {
        const pendingListing = await getListing(pending.listingId);
        const pendingUser = await getDisplayName(pending.sellerId);
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
