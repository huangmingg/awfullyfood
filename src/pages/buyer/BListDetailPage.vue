<template>
  <div>
    <b-button v-on:click="back()">
      Back
    </b-button>
    List Detail
  </div>
</template>

<script>
import { router } from "@/routes";

export default {
  name: "BListDetailPage",
  created() {
    const listingId = this.$route.params.id;
    console.log(listingId)
  },
  methods: {
    back: function() {
      router.back();
    }
  }
}
</script>

<style scoped>

</style>
