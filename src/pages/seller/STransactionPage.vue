<template>
  <div>
    Transaction Page
    <br><br>

    <b-list-group>
    <b-list-group-item class="d-flex justify-content-between align-items-center">
            Cras justo odio
        <b-badge variant="primary" pill>14</b-badge>
    </b-list-group-item>

    <b-list-group-item class="d-flex justify-content-between align-items-center">
            Dapibus ac facilisis in
        <b-badge variant="primary" pill>2</b-badge>
    </b-list-group-item>

    <b-list-group-item class="d-flex justify-content-between align-items-center">
            Morbi leo risus
        <b-badge variant="primary" pill>1</b-badge>
    </b-list-group-item>
    </b-list-group>

    <br><br>
    <b-button variant="primary" v-on:click="navigate(transaction.id)">
        View More
      </b-button>
  </div>
</template>

<script>
import { getTransactions } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionPage",
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  created() {
    getTransactions();
  },
  methods: {
    navigate: function (transactionId) {
      router.push(`transaction/${transactionId}`);
    }
  }
}
</script>

<style scoped>

</style>