<template>
  <div>
    Transaction Page
    <br><br>

  <b-card-group deck>
    <b-card
        v-for="list in listing"
        v-bind:key="list.id">
      <b-card-text>
        {{ list.buyerId }}
      </b-card-text>

      <b-button variant="primary" v-on:click="navigate(list.id)">
        View More
      </b-button>
    </b-card>
  </b-card-group>

  
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
    <b-button variant="primary" v-on:click="navigate(list.id)">
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