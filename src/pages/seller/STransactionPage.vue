<template>
  <div>
    Transaction Page
    <br><br>

  <b-list-group deck>
      <b-list-group-item v-for="list in listing"
        v-bind:key="list.id"
        v-on:click="navigate(list.id)"
        class="d-flex justify-content-between align-items-center">
        {{ list.name }}<br>
        >> {{ list.description }}
        
        <b-badge variant="primary" pill>14</b-badge>
      </b-list-group-item>

  </b-list-group>

  <br><br>

  </div>
</template>

<script>
import { getListingBySeller } from "@/services/list.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionPage",
  computed: {
    listing() {
      return store.getters.getList;
    },
  },

  async created() {
    const res = await getListingBySeller(store.getters.getProfileState?.id);
    console.log(res);
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