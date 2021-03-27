<template>
  <div>
    <h1>Available Transactions</h1><br>

    <b-button v-on:click="back()">Back </b-button>

  <br><br>

  </div>
</template>

<script>
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "SReviewPage",
  computed: {
    listing() {
      return store.getters.getList;
    },
  },

  async created() {
  },
  
  methods: {
    back: function() {
      router.back();
    },
  }
}
</script>

<style scoped>

h1 {
  color:  #cc0044;
  font-size: 26px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
}

</style>