<template>
  <div class="content">
    Bookmark Page
    <ul class="listContainer">
      <li v-for="listing in bookmarks" v-bind:key="listing.id">
        
        Item: {{listing.item}} <br>
        Quantity: {{listing.quantity}} {{listing.unit}} <br>
        Seller: {{listing.user}} <br><br>
        <b-button v-bind:id="listing.id" v-on:click="route(listing.listingId)">View Listing</b-button>

      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile, getDisplayName } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";
import { getBookmarks } from "@/services/bookmark.service";
import { getListing } from "@/services/list.service";

export default {
  name: "BBookmarkPage",
  data() {
    return {
      bookmarks: [],
    };
  },
  methods: {
    route: function(event) {
        //var userId = event.target.getAttribute("id")
        this.$router.push({ path: `/buyer/list/${event}` })
    }
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
          unit: listing.unit
        };
      })
    );
    console.log(this.bookmarks);
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

.numberCard {
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  margin-bottom: 100px;
}

.orderList {
  overflow: auto;
}
</style>
