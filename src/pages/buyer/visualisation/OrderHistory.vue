<template>
  <div class="content">
    <h5>Order History</h5>
    <hr>
    <ul>
      <li v-for="order in orderHistory" v-bind:key="order.id">
        You saved! {{order.quantity}} {{order.unit}} of {{order.item}} from being wasted from {{order.seller}}! <br> {{order.date}}.
        <hr>
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
  name: "Order History",
  data() {
    return {
      orderHistory: [],
      orderHistoryToString: [],
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
              //console.log(listingId);
              //console.log(sellerId)
              orderMap["quantity"] = doc.data()["quantity"];
              var date = new Date(doc.data()["completedAt"].seconds * 1000);
              
              orderMap["date"] = date.toLocaleString();
              database
                .collection("listings")
                .doc(listingId)
                .get()
                .then((querySnapShot2) => {
                  var itemListing = querySnapShot2.data()
                  //console.log(itemListing ["name"])
                  orderMap["item"] = itemListing ["name"];
                  //console.log(orderMap["item"]);
                  orderMap["unit"] = itemListing ["unit"];
                });
              
              database
                .collection("users")
                .doc(sellerId)
                .get()
                .then((querySnapShot3) => {
                  var users = querySnapShot3.data();
                  orderMap["seller"] = users["name"];
                });
              //console.log(orderMap);
              this.orderHistory.push(orderMap);
              //console.log(this.orderHistory);
            }
          });
        });
    },

  },
  components: {},

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.fetchItems();
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
</style>
