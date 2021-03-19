<template>
  <div>
    
    <b-button v-on:click="back()">Back </b-button>
    Transaction Detail Page
  </div>
</template>

<script>
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  computed: {
  },
  async created() {
  },
  methods: {
    back: function() {
      router.back();
    }
  },
}
</script>

<style scoped>

</style>