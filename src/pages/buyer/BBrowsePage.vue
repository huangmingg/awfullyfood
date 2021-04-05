<template>
  <div>
    <b-button-group>
      <BrowseModal v-on:filterListing="filterListing"/>
      <SortModal v-on:sortListing="sortListing" />
    </b-button-group>

    <!--search button-->
    <span class="float-right">
      <div class="input-group">
        <b-input
          type="search"
          class="form-control rounded mr-1"
          placeholder="Enter Listing Name"
          aria-label="Search"
          aria-describedby="search-addon"
          id="searchEntry"
          v-model.lazy="content"
        />
        <b-button type="button" class="btn btn-info" v-on:click="search()">
          Search
        </b-button>
      </div>
    </span>

    <hr class="dropdown-divider" />
    <!--listing-->
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
        v-on:click="navigate(list.id)"
      >
        <b-card-text>
          {{ list.description }}
          <br />
          ${{ list.price }} per {{ list.unit }}
          <small>
            <br />
            Created Date: {{ convertTimestamp(list.createdAt) }}
            <br />
            Expiry Date: {{ convertTimestamp(list.expiredAt) }}
          </small>
        </b-card-text>
        <b-icon-heart-fill style="color: red"></b-icon-heart-fill>
        <span>
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { getListings } from "@/services/list.service";
import { store } from "@/stores";
import { router } from "@/routes";
import BrowseModal from "@/components/BrowseModal";
import SortModal from "@/components/SortModal";
import { BIconHeartFill } from "bootstrap-vue";
import { convertTimestamp } from "@/services/utils.service";

export default {
  name: "BBrowsePage",
  components: { BrowseModal, SortModal, BIconHeartFill },
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

  watch: {
    content: function (newQuery) {
      this.content = newQuery;
      this.sanitizeQuery();
      store.dispatch('setFilter', {...store.getters.getFilter, nameSubstring: this.content});
      store.dispatch('filterList');
    }
  },

  async created() {
    const loader = this.$loading.show({ color: 'teal' });
    await getListings();
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');

    await store.dispatch('resetOrder');
    await store.dispatch('orderList');
    loader.hide();
  },

  methods: {
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },

    convertTimestamp: function (timestamp) {
      return convertTimestamp(timestamp);
    },

    search: function () {
      this.sanitizeQuery();
      if (this.content) {
        store.dispatch('setFilter', { ...store.getters.getFilter, nameSubstring: this.content });
        store.dispatch('filterList');
      } else {
        alert("Invalid search field!");
      }
    },

    sanitizeQuery: function () {
      this.content = this.content.trim();
    },

    filterListing(form) {
      store.dispatch('setFilter', form)
      store.dispatch('filterList');
    },

    sortListing(order) {
      store.dispatch('setOrder', order)
      store.dispatch('orderList')
    }

  },
};
</script>

<style scoped>
input {
  display: inline-block;
}

.list-item:hover {
  background-color: rgb(243, 250, 251);
  background-image: none;
  cursor: pointer;
}
</style>
