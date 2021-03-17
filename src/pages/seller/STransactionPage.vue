<template>
  <div>
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
    <b-button v-on:click="back()">Back </b-button>
    Transaction Page
  </div>
</template>

<script>
import { router } from "@/routes";

export default {
  name: "SListPage",
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