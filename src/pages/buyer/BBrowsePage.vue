<template>
  <b-card-group deck>
    <b-card
        v-for="list in listing"
        v-bind:key="list.id"
        :title=list.name
        :img-src=list.imageURL
        img-alt="Image"
        img-top
        img-height="200"
        img-width="150"
        style="max-width: 20rem;"
        class="mb-2"
        border-variant="primary"

    >
      <b-card-text>
        {{ list.description }}
      </b-card-text>

      <b-button variant="primary" v-on:click="navigate(list.id)">
        View More
      </b-button>
    </b-card>
  </b-card-group>
</template>

<script>
import { getListings } from "@/services/list.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "BBrowsePage",
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  created() {
    getListings();
  },

  methods: {
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    }
  }
}
</script>

<style scoped>

</style>
