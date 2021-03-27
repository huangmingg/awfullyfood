<template>
  <div>
    <b-button v-on:click="back()" variant="info">
      Back
    </b-button>
    <div class="row">
      <div class="column">
        <img v-bind:src="itemImg">
      </div>
      <div class="column">
        <div>
        <span class="header">
          {{itemName}}
        </span>
        <span class="float-right">
          <span id="sellerStyle">
          By: {{seller}}
          </span>
          <span class="float-right">
          <b-form-rating v-model="itemRating" variant="info" readonly></b-form-rating>
          </span>
        </span>
        </div>
        <div>
          Category: {{itemCategory}}
        </div>
        <div>
          Price: {{itemPrice}}
        </div>
        <div>
          Description: {{itemDescription}}
        </div>
        <div>
          Location: {{location}}
        </div>
        <div>
          Contact Details: {{contactDetails}}
        </div>
        <div>
          Additional Notes: {{additionalNotes}}
        </div>

        <br>

        <b-button v-on:click="interested()" variant="info">
          I'm interested!
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { router } from "@/routes";
import { getListings } from "@/services/list.service";
import { store } from "@/stores";

export default {
  name: "BListDetailPage",
  data() {
    return {
      itemImg:"",
      itemName:"",
      itemCategory:"",
      itemPrice:"", //price and units
      itemRating: 0,
      seller:"", //get seller name
      itemDescription:"",
      location:"", //missing
      contactDetails:"", //from seller side?
      additionalNotes:""
    }
  },
  created() {
    getListings();
    const itemDetails =store.getters.getList[0]
    const listingId = this.$route.params.id;
    //const itemDetails = [] //retrieve details from database
    console.log(listingId)
    this.itemImg = itemDetails.imageURL;
    this.itemName = itemDetails.name;
    this.itemCategory = itemDetails.category;
    this.itemPrice = "$" + itemDetails.price + " per " + itemDetails.unit;
    this.itemRating = 2.5; //currently no rating component in lisiting
    this.seller = itemDetails.sellerId; //get seller name using seller id 
    this.itemDescription = itemDetails.description;
    this.location = "unknown (missing)";
    this.contactDetails = "seller number (KIV)" //shld we include this? no privacy though
    this.additionalNotes = "NA (missing)"
  },
  methods: {
    back: function() {
      router.back();
    },
    interested: function() {
      alert("Seller is notified! Seller will contact you soon!");
    }
  }
}
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
  font-weight: bold
}

.checked {
  color: orange;
}

#sellerStyle {
  display:inline-block;
  padding-right: 10px;
  padding-top: 5px;
}
</style>
