<template>
  <div>
    <!--search button-->
    <span class="float-right">
      <div class="input-group">
        <b-input
          v-model.lazy="content"
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
        />
      </div>
    </span>

    <b-button-group>
      <span>
        <SortModal @sortListing="sortListing" />
      </span>

      <span>
        <b-button
          variant="info"
          class="ml-auto"
          @click="addListing()"
        >Create Listing</b-button>
      </span>
    </b-button-group>

    <hr class="dropdown-divider">
    <b-card-group deck>
      <b-card
        v-for="list in listing"
        :key="list.id"
        :title="list.name"
        :img-src="list.photo"
        img-alt="Image"
        img-top
        img-height="200"
        img-width="150"
        style="max-width: 20rem"
        class="mb-2 list-item"
        border-variant="info"
        @click="edit(list.id)"
      >
        <b-card-text>
          {{ list.description }}
          <br>
          ${{ list.price }} per {{ list.unit }}
          <br>
          <small>Created Date:
            {{ list.createdAt.toDate().toLocaleDateString() }}</small>
          <br>
          <small>Expiry Date:
            {{ list.expiredAt.toDate().toLocaleDateString() }}</small>
          <div
            v-show="checkExpire(list.expiredAt)"
            style="color: red"
          > 
            Expired!
          </div>
        </b-card-text>
        <b-icon-heart-fill style="color: red" />
        <span style="color: red">
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { store } from '@/stores';
import { getListingBySeller } from '@/services/list.service';
import { router } from '@/routes';
import SortModal from '@/components/SortModal';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { convertTimestamp } from '@/services/utils.service';

export default {
  name: 'SListDetailPage',
  components: { SortModal },
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
    await getListingBySeller(store.getters.getProfileId);
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');
    loader.hide();
  },

  methods: {
    edit(listId) {
      router.push(`list/detail/${listId}`);
    },

    sanitizeQuery() {
      this.content = this.content.trim();
    },

    convertTimestamp(timestamp) {
      return convertTimestamp(timestamp);
    },

    addListing() {
      router.push('list/add');
    },

    sortListing(order) {
      store.dispatch('setOrder', order);
      store.dispatch('orderList');
    },
    checkExpire(expire) {
      return expire.toDate().toLocaleDateString() < new Date().toLocaleDateString()
    },
  },
};
</script>

<style scoped>
.list-item:hover {
  background-color: rgb(243, 250, 251);
  cursor: pointer;
}

</style>
