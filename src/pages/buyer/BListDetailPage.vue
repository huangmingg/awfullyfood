<template>
  <div>
    <b-button
      variant="info"
      @click="back()"
    >
      Back
    </b-button>

    <hr class="dropdown-divider">

    <div class="row">
      <div class="column">
        <img :src="itemImg">
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
              />
            </span>
          </span>
        </div>
        <div><b>Category:</b> {{ itemCategory }}</div>
        <div><b>Price:</b> {{ itemPrice }}</div>
        <div><b>Quantity:</b> {{ itemQty }}</div>
        <div><b>Description:</b> {{ itemDescription }}</div>
        <div><b>Location:</b> {{ location }}</div>
        <div><b>Created Date:</b> {{ createdAt }}</div>
        <div><b>Expiry Date:</b> {{ expiredAt }}</div>

        <br>

        <div class="float-right">
          <span>
            <b-button
              id="bookmarkBtn"
              @click="changeBMClass()"
            >
              <BIconHeartFill variant="white" />
            </b-button>
          </span>
          <span>
            <b-button
              variant="info"
              @click="validateTransaction()"
            >
              I'm interested!
            </b-button>
          </span>
        </div>
      </div>
    </div>
    <QuantityModal
      v-if="validTransaction"
      :max-quantity="parseInt(itemQty)"
      @quantity="interested"
    />
  </div>
</template>

<script>
import { router } from '@/routes';
import { getDisplayName, getUserProfile } from '@/services/user.service';
import { getListing } from '@/services/list.service';
import { BIconHeartFill } from 'bootstrap-vue';
import { store } from '@/stores';
import { authService } from '@/firebase';
import { toggleBookmark } from '@/services/bookmark.service';
import {
  createTransaction,
  getTransactionsByListing,
} from '@/services/transaction.service';
import { convertTimestamp } from '@/services/utils.service';
import QuantityModal from '@/components/QuantityModal';

export default {
  name: 'BListDetailPage',
  components: { BIconHeartFill, QuantityModal },
  data() {
    return {
      itemImg: '',
      itemName: '',
      itemCategory: '',
      itemPrice: '', // price and units
      itemQty: 0,
      itemRating: 0,
      seller: '', //get seller name
      itemDescription: '',
      location: '', //missing
      bookmarkAllClasses: ['btn btn-danger', 'btn btn-secondary'],
      expiredAt: '',
      createdAt: '',
      listingId: '',
      sellerId: '',
      validTransaction: false,
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
    back() {
      router.back();
    },
    valid() {
      console.log(this.validTransaction);
      return this.validTransaction;
    },
    validateTransaction() {
      const userId = store.getters.getProfileState.id;
      const allTransactions = getTransactionsByListing(this.listingId);
      const findTransaction = allTransactions.then((x) =>
        x.filter((y) => y.buyerId === userId)
      );
      findTransaction.then((x) => {
        if (x.length > 0) {
          alert(
            'You have already expressed your interest on ' +
              convertTimestamp(x[0].createdAt)
          );
          this.validTransaction = false;
        } else {
          this.validTransaction = true;
        }
      });
    },
    interested(interestedQty) {
      const transaction = {
        listingId: this.listingId,
        buyerId: store.getters.getProfileState.id,
        sellerId: this.sellerId,
        quantity: interestedQty,
        createdAt: new Date(),
        completedAt: '',
        deletedAt: '',
      };
      createTransaction(transaction);
      alert('Seller is notified! Seller will contact you soon!');
    },
    checkBookmark(bookmarkLst) {
      const userId = store.getters.getProfileState.id;
      let changed = false;
      for (const bm of bookmarkLst) {
        if (bm.userId === userId) {
          document.getElementById(
            'bookmarkBtn'
          ).className = this.bookmarkAllClasses[0];
          changed = true;
          break;
        }
      }
      if (!changed) {
        document.getElementById(
          'bookmarkBtn'
        ).className = this.bookmarkAllClasses[1];
      }
    },

    retrieveInfo(listingId) {
      const itemDetails = getListing(listingId); // retrieve details from database
      itemDetails.then((x) => {
        this.listingId = listingId;
        this.itemImg = x.imageURL;
        this.itemName = x.name;
        this.itemCategory = x.category;
        this.itemPrice = `$${x.price} per ${x.unit}`;
        this.itemQty = x.quantity;
        this.itemRating = 2.5; // currently no rating component in listing
        this.itemDescription = x.description;
        this.location = x.location;
        this.expiredAt = x.expiredAt.toDate().toLocaleDateString();
        this.createdAt = x.createdAt.toDate().toLocaleDateString();
        this.checkBookmark(x.bookmarks);
        this.sellerId = x.sellerId;
        getDisplayName(x.sellerId).then((y) => (this.seller = y));
      });
    },
    // need to update the database (toggling the bookmark buttons)
    changeBMClass() {
      const name = document.getElementById('bookmarkBtn').className;
      if (name == this.bookmarkAllClasses[0]) {
        // un-bookmark
        document.getElementById(
          'bookmarkBtn'
        ).className = this.bookmarkAllClasses[1];
      } else {
        // bookmark
        document.getElementById(
          'bookmarkBtn'
        ).className = this.bookmarkAllClasses[0];
      }
      toggleBookmark(this.listingId, store.getters.getProfileState.id);
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
