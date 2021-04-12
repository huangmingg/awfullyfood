<template>
  <div class="content">
    <b-row>
      <b-card
        v-for="list in bookmarks"
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
      >
        <b-card-text>
          ${{ list.price }} per {{ list.unit }}
          <small>
            <br>
            {{ wrapText(list.description) }}
            <br>
            Quantity: {{ list.quantity }} {{ list.unit }}
            <br>
            Expiry Date: {{ convertTimestamp(list.expiredAt) }}
          </small>
          <hr>
          <b-button-group class="mx-auto">
            <b-button
              variant="outline-info"
              @click="route(list.id)"
            >
              View
            </b-button>
            <b-button
              variant="outline-danger"
              @click="removeBookmark(list.id)"
            >
              Remove Bookmark
            </b-button>
          </b-button-group>
        </b-card-text>
      </b-card>
    </b-row>
  </div>
</template>

<script>
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { store } from '@/stores';
import { toggleBookmark, getBookmarkLists } from '@/services/bookmark.service';
import { convertTimestamp } from '@/services/utils.service';

export default {
  name: 'BBookmarkPage',
  data() {
    return {
    };
  },
  computed: {
    bookmarks() {
      return store.getters.getBookmarkLists;
    },
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getBookmarkLists(store.getters.getProfileId);
    loader.hide();
  },

  methods: {
    route(event) {
      this.$router.push({ path: `/buyer/browse/${event}` });
    },
    convertTimestamp(timestamp) {
      return convertTimestamp(timestamp);
    },
    async removeBookmark(listingId) {
      await toggleBookmark(listingId, store.getters.getProfileState?.id);
      alert('Bookmark Removed');
      const loader = this.$loading.show({ color: 'teal' });
      await getBookmarkLists(store.getters.getProfileId);
      loader.hide();
    },
    wrapText(text) {
      return text ? `${text.substring(0, 40)}...` : '';
    },
  },
};
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 0;
  flex-basis: 300px;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 10px;
  border: 1px solid #e6e6e6;
  max-height: 500px;
}

button {
  margin-right: 4px;
}

input {
  display: inline-block;
}

</style>
