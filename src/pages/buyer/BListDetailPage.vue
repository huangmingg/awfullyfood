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
        <b>
          <div
            v-show="checkExpire()"
            style="color: red; font-size: 20px"
          >
            Expired!
          </div>
        </b>
        <div>Category: {{ itemCategory }}</div>
        <div>Price: {{ itemPrice }}</div>
        <div>Quantity: {{ itemQty }}</div>
        <div>Description: {{ itemDescription }}</div>
        <div>Created Date: {{ createdAt }}</div>
        <div>Expiry Date: {{ expiredAt }}</div>
        <br>

        <div class="float-right">
          <span>
            <b-button
              v-show="checkExpire()==false"
              id="bookmarkBtn"
              @click="changeBMClass()"
            >
              <BIconHeartFill variant="white" />
            </b-button>
            <b-button
              v-show="checkExpire()==true"
              id="expire"
              title="Expired!"
              disabled
            >
              <BIconHeartFill variant="white" />
            </b-button>
          </span>
          <span>
            <b-button
              v-show="checkExpire()==false"
              variant="info"
              @click="validateTransaction()"
            >
              I'm interested!
            </b-button>
            <b-button
              v-show="checkExpire()==true"
              id="expire"
              variant="info"
              title="Expired!"
              disabled
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
import { convertTimestamp, convertDateObject, getCurrentTimestamp, convertDateString } from '@/services/utils.service';
import QuantityModal from '@/components/QuantityModal';
import {
  createTransaction,
  getTransactionsByListing,
} from '@/services/transaction.service';

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
      seller: '', // get seller name
      itemDescription: '',
      bookmarkAllClasses: ['btn btn-danger', 'btn btn-secondary'],
      expiredAt: '',
      createdAt: '',
      validTransaction: false,
      listingId: '',
      sellerId: '',
      userId: '',
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

    validateTransaction() {
      const allTransactions = getTransactionsByListing(this.listingId);
      console.log(this.listingId);
      const findTransaction = allTransactions.then((x) =>
        x.filter((y) => y.buyerId === this.userId)
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
        buyerId: this.userId,
        sellerId: this.sellerId,
        quantity: interestedQty,
        createdAt: convertDateObject(new Date()),
        completedAt: '',
        deletedAt: '',
      };
      createTransaction(transaction);
      alert('Seller is notified! Seller will contact you soon!');
    },

    checkBookmark(bookmarkLst) {
      let changed = false;
      for (const bm of bookmarkLst) {
        if (bm.userId === this.userId) {
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
        this.itemImg = x.imageURL;
        this.itemName = x.name;
        this.itemCategory = x.category;
        this.itemPrice = `$${x.price} per ${x.unit}`;
        this.itemQty = x.quantity;
        this.itemRating = 2.5; // currently no rating component in listing
        this.itemDescription = x.description;
        this.expiredAt = convertTimestamp(x.expiredAt);
        this.createdAt = convertTimestamp(x.createdAt);
        this.checkBookmark(x.bookmarks);
        getDisplayName(x.sellerId).then((y) => (this.seller = y));
        this.listingId = listingId;
        this.sellerId = x.sellerId;
        this.userId = store.getters.getProfileState.id;
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

      // listing id, user id
      toggleBookmark(this.$route.params.id, this.userId);
    },

    checkExpire() {
      const expire = convertDateString(this.expiredAt);
      const expired_s = expire.seconds;
      const expired_ns = expire.nanoseconds;
      const curr_s = getCurrentTimestamp().seconds;
      const curr_ns = getCurrentTimestamp().nanoseconds;
      if (expired_s < curr_s || (expired_s == curr_s && expired_ns < curr_ns)) {
        return true;
      } else {
        return false;
      }
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
