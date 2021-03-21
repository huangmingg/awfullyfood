<template>
  <div class="content">
    <h5>Most Interested Listings</h5>
    <hr />
    <ul>
      <li v-for="order in sellerListings" v-bind:key="order.id">
        {{ order.quantity }} {{ order.unit }} of {{ order.name }} <br />
        {{ order.interests.length }} interested.
        <hr />
      </li>
    </ul>
  </div>
</template>

<script>
//import database from "../../../firebase.js";
import { getListingBySeller } from "@/services/list.service";
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  name: "Top Interests",
  data() {
    return {
      sellerListings: [],
      show: true,
    };
  },
  methods: {
    sortArrays(arrays) {
      return this._.orderBy(arrays, "interests", "desc");
    },
    forceUpdate() {
      this.show = true;
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
  components: {},
  //   computed: {
  //       orderedByLikes: function () {
  //           return this._.orderBy(this.sellerListings, 'likes')
  //       }
  //   },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.sellerListings = await getListingBySeller(
      store.getters.getProfileState?.id
    )
    await this.sellerListings.sort((a,b) => (b.likes > a.likes) ? 1 : ((a.likes > b.likes) ? -1 : 0));
    //await this.sleep(300).then(this.forceUpdate);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ordersList {
  width: 50%;
  max-width: 100%;
  margin: 10px;
  padding: 0 5px;
  box-sizing: border-box;
}

#listContainer {
  float: left;
  width: 100%;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 1;
  flex-basis: 300px;
  text-align: center;
  padding: 1px;
  margin: 5px;
}

button {
  padding: 5px;
  margin: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
