<template>
  <div class="content">
    <h1>{{ noTransactions }}</h1>
    <h5>Number of Completed Orders</h5>
  </div>
</template>

<script>
import { getApprovedTransactionsBySeller } from "@/services/transaction.service";
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  name: "SApprovedTransactionCounter",
  data() {
    return {
      noTransactions: 0,
      ApprovedTransactions: [],
    };
  },
  methods: {},
  components: {},

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.ApprovedTransactions = await getApprovedTransactionsBySeller(
      store.getters.getProfileState?.id
    );
    console.log(this.ApprovedTransactions);
    this.noTransactions = this.ApprovedTransactions.length;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ordersList {
  width: 50%;
  max-width: 100%;
  margin: 10px;
  padding: 0 5px;
  box-sizing: border-box;
}

#listContainer {
  float: left;
  width: 100%;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 1;
  flex-basis: 300px;
  text-align: center;
  padding: 10px;
  border: 1px solid #222;
  margin: 10px;
}

button {
  padding: 5px;
  margin: 10px;
}
</style>
