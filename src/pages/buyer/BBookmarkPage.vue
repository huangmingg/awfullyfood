<template>
  <div class="content">
    Bookmark Page

    <b-card-group deck>
      <b-card
        v-for="list in bookmarks"
        v-bind:key="list.id"
        :title="list.item"
        img-alt="Image"
        img-top
        img-height="200"
        img-width="150"
        style="max-width: 20rem"
        class="mb-2 list-item"
        border-variant="info"
        v-on:click="route(list.id)"
      >
        <b-card-text>
          ${{ list.price }} per {{ list.unit }} <br />
          Quantity: {{ list.quantity }} {{ list.unit }}
          <small>
            <br />
            Seller: {{ list.user }}
            <br />
            <br />
            <b-button
              v-bind:id="list.id"
              v-on:click="removeBookmark(list.listingId)"
              >Remove Bookmark</b-button
            >
          </small>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { getUserProfile, getDisplayName } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import { getBookmarks, toggleBookmark } from "@/services/bookmark.service";
import { getListing } from "@/services/list.service";

export default {
  name: "BBookmarkPage",
  data() {
    return {
      bookmarks: [],
    };
  },
  methods: {
    route: function (event) {
      this.$router.push({ path: `/buyer/browse/${event}` });
    },
    removeBookmark: async function (listingId) {
      await toggleBookmark(listingId, store.getters.getProfileState?.id);
      alert("Bookmark Removed");
      location.reload();
    },
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  },

  async mounted() {
    const bookmarkedListings = await getBookmarks(
      store.getters.getProfileState?.id
    );
    this.bookmarks = await Promise.all(
      bookmarkedListings.map(async (bookmarkedListing) => {
        const listing = await getListing(bookmarkedListing);
        const user = await getDisplayName(listing.sellerId);
        return {
          listingId: bookmarkedListing,
          user: user,
          item: listing.name,
          quantity: listing.quantity,
          unit: listing.unit,
          price: listing.price,
        };
      })
    );
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

input {
  display: inline-block;
}

.list-item:hover {
  background-color: rgb(243, 250, 251);
  background-image: none;
  cursor: pointer;
}
</style>
