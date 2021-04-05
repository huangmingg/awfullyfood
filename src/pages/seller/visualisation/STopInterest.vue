<template>
  <div class="content">
    <h5>Most Interested Listings</h5>
    <hr>
    <ul>
      <li
        v-for="order in sellerListings"
        :key="order.id"
      >
        {{ order.quantity }} {{ order.unit }} of {{ order.name }} <br>
        {{ order.interests.length }} interested. <br>
        <b-button
          :id="order.id"
          @click="route($event)"
        >
          View Listing
        </b-button>
        <hr>
      </li>
    </ul>
  </div>
</template>

<script>
import { getListingBySeller } from '@/services/list.service';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { store } from '@/stores';

export default {
  name: 'STopInterests',
  components: {},
  data() {
    return {
      sellerListings: [],
      show: true,
    };
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.sellerListings = await getListingBySeller(
      store.getters.getProfileState?.id
    );
    await this.sellerListings.sort((a, b) => ((b.likes > a.likes) ? 1 : ((a.likes > b.likes) ? -1 : 0)));
  },
  methods: {
    route(event) {
      const userId = event.target.getAttribute('id');
      this.$router.push({ path: `/seller/list/${userId}` });

    },
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
