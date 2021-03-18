<template>
  <div class="content">
    Buyer Home Page
    <ul class="chartCardContainer">
      <li>
        <category-chart></category-chart>
        
      </li>
      <li>
        <div class = "numberCard">
          <h1 class="bigNumber"><transactions-counter></transactions-counter></h1>
          <h5>Number of Approved Transactions</h5>
        </div>
      </li>
      <li>
        <transactions-counter></transactions-counter>
      </li>
      <li>
        <category-chart></category-chart>
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
import TransactionsCounter from "./visualisation/TransactionsCounter.vue";

export default {
  name: "BHomePage",
  components: {
    CategoryChart,
    TransactionsCounter,
    
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
  align-items:center;
  margin-top:50%;

  
}

</style>
