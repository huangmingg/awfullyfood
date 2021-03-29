<template>
  <div class="content">
    <h5>Order History</h5>
    <hr />
    <ul>
      <li v-for="order in orderHistory" v-bind:key="order.id">
        <transition name="fade">
          <div v-if="show">
            You saved {{ order.quantity }} {{ order.unit }} of
            {{ order.item }} from being wasted from {{ order.seller }}!
            <br />Order completed at {{ order.date }}.
            <hr />
          </div>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script>
import database from "../../../firebase.js";
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  name: "BOrderHistory",
  data() {
    return {
      orderHistory: [],
      show: false,
    };
  },
  methods: {
    fetchItems: function () {
      database
        .collection("transactions")
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            var orderMap = new Map();

            if (
              doc.data()["isApproved"] &&
              doc.data()["buyerId"] == store.getters.getProfileState?.id
            ) {
              var listingId = doc.data()["listingId"];
              var sellerId = doc.data()["sellerId"].toString();
              orderMap["quantity"] = doc.data()["quantity"];
              var date = new Date(doc.data()["completedAt"].seconds * 1000);
              orderMap["date"] = date.toLocaleString();
              database
                .collection("listings")
                .doc(listingId)
                .get()
                .then((querySnapShot2) => {
                  var itemListing = querySnapShot2.data();
                  orderMap["item"] = itemListing["name"];
                  orderMap["unit"] = itemListing["unit"];
                });

              database
                .collection("users")
                .doc(sellerId)
                .get()
                .then((querySnapShot3) => {
                  var users = querySnapShot3.data();
                  orderMap["seller"] = users["name"];
                });
              this.orderHistory.push(orderMap);
            }
          });
        });
    },
    forceUpdate() {
      this.show = true;
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
  components: {},

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    await this.fetchItems();
    await this.sleep(300).then(this.forceUpdate);
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
