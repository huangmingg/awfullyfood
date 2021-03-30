<template>
  <div>
    <b-button v-on:click="back()" variant="info"> Back </b-button>
    <div class="row">
      <div class="column">
        <img v-bind:src="itemImg" />
      </div>
      <div class="column">
        <div>
          <span class="header">
            {{ itemName }}
          </span>
          <span class="float-right">
            <span id="sellerStyle"> By: {{ seller }} </span>
            <span class="float-right">
              <b-form-rating
                v-model="itemRating"
                variant="info"
                readonly
              ></b-form-rating>
            </span>
          </span>
        </div>
        <div>Category: {{ itemCategory }}</div>
        <div>Price: {{ itemPrice }}</div>
        <div>Description: {{ itemDescription }}</div>
        <div>Location: {{ location }}</div>
        <div>Additional Notes: {{ additionalNotes }}</div>

        <br />

        <div class="float-right">
          <span>
            <b-button id="bookmarkBtn" v-on:click="changeBMClass()">
              <BIconHeartFill variant="white"></BIconHeartFill>
            </b-button>
          </span>
          <span>
            <b-button v-on:click="interested()" variant="info">
              I'm interested!
            </b-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { router } from "@/routes";
import { getDisplayName, getUserProfile } from "@/services/user.service";
import { getListing } from "@/services/list.service";
import { BIconHeartFill } from "bootstrap-vue";
import { store } from "@/stores";
import { authService } from "@/firebase";
import {toggleBookmark} from "@/services/bookmark.service"

export default {
  components: { BIconHeartFill },
  name: "BListDetailPage",
  data() {
    return {
      itemImg: "",
      itemName: "",
      itemCategory: "",
      itemPrice: "", //price and units
      itemRating: 0,
      seller: "", //get seller name
      itemDescription: "",
      location: "", //missing
      additionalNotes: "",
      bookmarkAllClasses: ["btn btn-danger", "btn btn-secondary"],
    };
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const listingId = this.$route.params.id;
    this.retrieveInfo(listingId);
  },
  methods: {
    back: function () {
      router.back();
    },
    
    //update to db
    interested: function () {
      alert("Seller is notified! Seller will contact you soon!");
    },
    checkBookmark: function (bookmarkLst) {
      const userId = store.getters.getProfileState.id;
      var changed = false;
      for (const bm of bookmarkLst) {
        if (bm.userId === userId) {
          document.getElementById(
            "bookmarkBtn"
          ).className = this.bookmarkAllClasses[0];
          changed = true;
          break;
        }
      }
      if (!changed) {
        document.getElementById(
          "bookmarkBtn"
        ).className = this.bookmarkAllClasses[1];
      }
    },

    retrieveInfo: function (listingId) {
      const itemDetails = getListing(listingId); //retrieve details from database
      itemDetails.then((x) => {
        this.itemImg = x.imageURL;
        this.itemName = x.name;
        this.itemCategory = x.category;
        this.itemPrice = "$" + x.price + " per " + x.unit;
        this.itemRating = 2.5; //currently no rating component in listing
        this.itemDescription = x.description;
        this.location = "unknown (missing)";
        this.additionalNotes = "NA (missing)";
        this.checkBookmark(x.bookmarks);
        getDisplayName(x.sellerId).then((y) => (this.seller = y));
      });
    },
    //need to update the database (toggling the bookmark buttons)
    changeBMClass: function () {
      const name = document.getElementById("bookmarkBtn").className;
      if (name == this.bookmarkAllClasses[0]) {
        //un-bookmark
        document.getElementById(
          "bookmarkBtn"
        ).className = this.bookmarkAllClasses[1];
      } else {
        //bookmark
        document.getElementById(
          "bookmarkBtn"
        ).className = this.bookmarkAllClasses[0];
      }

      //listing id, user id
      toggleBookmark(this.$route.params.id, store.getters.getProfileState.id);
    },
  },
};
</script>

<style scoped>
.column {
  float: left;
  width: 40%;
  margin: 1%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

img {
  max-width: 100%;
  max-height: 100%;
  display: block; /* remove extra space below image */
}

div {
  padding-bottom: 1%;
}

.header {
  font-size: 2.5em;
  font-weight: bold;
}

#sellerStyle {
  display: inline-block;
  padding-right: 10px;
  padding-top: 5px;
}
</style>
