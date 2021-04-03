<template>
  <div>Add listing 

    <br>
    <b-button v-on:click="back()">Back </b-button>

  </div>
</template>

<script>
import { router } from "@/routes";

export default {
name: "SAddListPage.vue",
methods: {
    back: function() {
      router.back();
    },
}
}
</script>

<style scoped>

</style>
