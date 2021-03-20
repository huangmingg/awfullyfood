<template>
  <div>
  <b-container fluid>
    <b-list-group>
      <b-button variant="outline-info" class="ml-auto" v-on:click="addListing()">Create Listing</b-button>
      <hr class="dropdown-divider"/>
      <b-list-group-item
          v-for="(list, index) in listing"
          :key="index"
          class="flex-column align-items-start list-item">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ list.name }}</h5>
          <small> {{ list.createdAt.toDate().toLocaleDateString() }} </small>
        </div>
        <p class="mb-1">
          {{ list.description }}
        </p>
        <small>Expiring at: {{ list.expiredAt.toDate().toLocaleDateString() }}</small>
      </b-list-group-item>
    </b-list-group>
  </b-container>
  </div>
</template>

<script>
import { store } from "@/stores";
import { getListingBySeller } from "@/services/list.service";
import { router } from "@/routes";

export default {
  name: "SListDetailPage",
  data() {
    return {
      lists: []
    }
  },
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
    addListing: function() {
      router.push('list/add');
    }

  },
}
</script>

<style scoped>
.list-item:hover {
  background-color: honeydew;
  background-image: none;
  cursor: pointer;
}
</style>
