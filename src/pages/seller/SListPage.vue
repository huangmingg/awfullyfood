<template>
  <div>
    <!--b-container fluid>
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
  </b-container-->

    <!--search button-->
    <span class="float-right">
      <div class="input-group">
        <b-input
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          v-model.lazy="content"
        />
      </div>
    </span>

    <b-button-group>
      <span>
         <SortModal v-on:sortListing="sortListing" />
      </span>

      <span>
        <b-button variant="info" class="ml-auto" v-on:click="addListing()"
          >Create Listing</b-button
        >
      </span>
    </b-button-group>

    <hr class="dropdown-divider" />
    <b-card-group deck>
      <b-card
        v-for="list in listing"
        v-bind:key="list.id"
        :title="list.name"
        :img-src="list.photo"
        img-alt="Image"
        img-top
        img-height="200"
        img-width="150"
        style="max-width: 20rem"
        class="mb-2 list-item"
        border-variant="info"
        v-on:click="edit(list.id)"
      >
        <b-card-text>
          {{ list.description }}
          <br />
          ${{ list.price }} per {{ list.unit }}
          <br />
          <small
            >Created Date:
            {{ convertTimestamp(list.createdAt) }}</small
          >
          <br />
          <small
            >Expiry Date:
            {{ convertTimestamp(list.expiredAt) }}</small
          >
        </b-card-text>
        <b-icon-heart-fill style="color: red"></b-icon-heart-fill>
        <span style="color: red">
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { store } from "@/stores";
import { getListingBySeller } from "@/services/list.service";
import { router } from "@/routes";
import SortModal from "@/components/SortModal";
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { convertTimestamp } from "@/services/utils.service";

export default {
  name: "SListDetailPage",
  components: { SortModal },
  data() {
    return {
      content: "",
    };
  },
  computed: {
    listing() {
      return store.getters.getFilteredList;
    },
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getListingBySeller(store.getters.getProfileId);
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');
    loader.hide();
  },

  watch: {
    content: function (newQuery) {
      this.content = newQuery;
      this.sanitizeQuery();
      store.dispatch('setFilter', {...store.getters.getFilter, nameSubstring: this.content});
      store.dispatch('filterList');
    }
  },

  methods: {
    edit: function (listId) {
      router.push(`list/detail/${listId}`);
    },

    sanitizeQuery: function () {
      this.content = this.content.trim();
    },
    
    convertTimestamp: function (timestamp) {
      return convertTimestamp(timestamp);
    },

    addListing: function () {
      router.push("list/add");
    },

    sortListing(order) {
      store.dispatch('setOrder', order);
      store.dispatch('orderList');
    }
  },
};
</script>

<style scoped>
.list-item:hover {
  background-color: rgb(243, 250, 251);
  cursor: pointer;
}

</style>
