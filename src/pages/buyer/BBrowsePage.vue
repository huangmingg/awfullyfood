<template>
  <div>
    <b-button-group>
      <BrowseModal @filterListing="filterListing" />
      <SortModal @sortListing="sortListing" />
    </b-button-group>

    <!--search button-->
    <span class="float-right">
      <b-input
        id="searchEntry"
        v-model.lazy="content"
        type="search"
        class="form-control rounded mr-1"
        placeholder="Enter Listing Name"
        aria-label="Search"
        aria-describedby="search-addon"
      />
    </span>

    <hr class="dropdown-divider">
    <!--listing-->
    <b-row>
      <b-card
        v-for="list in listing"
        :key="list.id"
        :title="list.name"
        :img-src="list.photo"
        img-alt="Image"
        img-top
        img-height="250px"
        img-width="150px"
        style="max-width: 20rem"
        class="m-3 list-item"
        border-variant="info"
        @click="navigate(list.id)"
      >
        <b-card-text>
          <b>
            <div
              v-show="checkExpire(list.expiredAt)"
              style="color: red; font-size: 20px"
            >
              Expired!
            </div>
          </b>
          {{ list.description }}
          <br>
          ${{ list.price }} per {{ list.unit }}
          <small>
            <br>
            Created Date: {{ convertTimestamp(list.createdAt) }}
            <br>
            Expiry Date: {{ convertTimestamp(list.expiredAt) }}
          </small>
        </b-card-text>
        <b-icon-heart-fill style="color: red" />
        <span>
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-row>
  </div>
</template>

<script>
import { getListings } from '@/services/list.service';
import { store } from '@/stores';
import { router } from '@/routes';
import BrowseModal from '@/components/BrowseModal';
import SortModal from '@/components/SortModal';
import { BIconHeartFill } from 'bootstrap-vue';
import { convertTimestamp, getCurrentTimestamp } from '@/services/utils.service';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';

export default {
  name: 'BBrowsePage',
  components: { BrowseModal, SortModal, BIconHeartFill },
  data() {
    return {
      content: '',
    };
  },
  computed: {
    listing() {
      return store.getters.getFilteredList;
    },
  },

  watch: {
    content(newQuery) {
      this.content = newQuery;
      this.sanitizeQuery();
      store.dispatch('setFilter', { ...store.getters.getFilter, nameSubstring: this.content });
      store.dispatch('filterList');
    },
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getListings();
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');

    await store.dispatch('resetOrder');
    await store.dispatch('orderList');
    loader.hide();
  },

  methods: {
    navigate(listId) {
      router.push(`browse/${listId}`);
    },

    convertTimestamp(timestamp) {
      return convertTimestamp(timestamp);
    },

    sanitizeQuery() {
      this.content = this.content.trim();
    },

    filterListing(form) {
      store.dispatch('setFilter', form);
      store.dispatch('filterList');
    },

    sortListing(order) {
      store.dispatch('setOrder', order);
      store.dispatch('orderList');
    },

    checkExpire(expiredAt) {
      const expired_s = expiredAt.seconds;
      const expired_ns = expiredAt.nanoseconds;
      const curr_s = getCurrentTimestamp().seconds;
      const curr_ns = getCurrentTimestamp().nanoseconds;
      if (expired_s < curr_s || (expired_s == curr_s && expired_ns < curr_ns)) {
        return true;
      } else {
        return false;
      }
    },

  },
};
</script>

<style scoped>

.list-item {
  width: 450px;
  height: 500px;
}

input {
  display: inline-block;
}

.list-item:hover {
  background-color: rgb(243, 250, 251);
  background-image: none;
  cursor: pointer;
}
</style>
