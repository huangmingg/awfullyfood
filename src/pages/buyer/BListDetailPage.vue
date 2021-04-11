<template>
  <div>
    <b-container
      fluid
      class="p-4 bg-light"
    >
      <b-row class="mx-2">
        <b-button
          variant="info"
          @click="back()"
        >
          Back
        </b-button>
      </b-row>
      <hr class="dropdown-divider">
      <b-form class="mx-3">
        <b-row>
          <b-img
            width="400"
            height="400"
            class="border-info product-photo"
            thumbnail
            fluid
            :src="item.photo"
          />
          <b-col class="mt-3">
            <div class="float-right">
              <b-card-sub-title class="my-3">
                By: <b-link :to="userSearchLink">
                  {{ seller.name }}
                </b-link>
                <b-form-rating
                  id="rating"
                  v-model="seller.rating"
                  readonly
                  inline
                />
              </b-card-sub-title>
            </div>
            <b-card-sub-title class="my-3">
              Name: {{ item.name }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Category: {{ item.category }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Price: ${{ item.price }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Quantity: {{ item.quantity }} {{ item.unit }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Description: {{ item.description }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Created Date: {{ convertTimestamp(item.createdAt) }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Expiry Date: {{ convertTimestamp(item.expiredAt) }}
            </b-card-sub-title>
            <div class="float-right">
              <b-button-group v-if="!hasExpired && !isSoldOut">
                <b-button
                  id="bookmarkBtn"
                  class="mr-1"
                  style="border-radius: 5px"
                  variant="outline-info"
                  @click="toggleBookmark"
                >
                  <BIconHeartFill :variant="iconColor" />
                </b-button>
                <QuantityModal
                  v-if="!hasExpired"
                  :max-quantity="+item.quantity"
                  @submitTransaction="submitTransaction"
                />
              </b-button-group>
              <b v-else>
                <div
                  v-if="hasExpired"
                  style="color: red; font-size: 16px"
                >
                  This listing has expired!
                </div>
                <div
                  v-else-if="isSoldOut"
                  style="color: red; font-size: 16px"
                >
                  This listing is sold out!
                </div>
              </b>
            </div>
          </b-col>
        </b-row>
      </b-form>
      <hr>
    </b-container>
  </div>
</template>

<script>
import QuantityModal from '@/components/QuantityModal';
import { BIconHeartFill } from 'bootstrap-vue';
import { router } from '@/routes';
import { store } from '@/stores';
import { authService } from '@/firebase';
import { getUserProfile, getDisplayName } from '@/services/user.service';
import { getListing } from '@/services/list.service';
import { toggleBookmark, isBookmarked } from '@/services/bookmark.service';
import { convertTimestamp, getCurrentTimestamp, hasExpired } from '@/services/utils.service';
import { createTransaction, getTransactionsByListing } from '@/services/transaction.service';
import { getReviews, getAggregatedRating } from '@/services/review.service';

export default {
  name: 'BListDetailPage',
  components: { BIconHeartFill, QuantityModal },
  data() {
    return {
      listingId: '',
      listingBookmarked: false,
      seller: {
        name: '',
        rating: 0,
      },
      item: {
        sellerId: '',
        name: '',
        price: 0,
        quantity: 0,
        unit: '',
        description: '',
        expiredAt: '',
        createdAt: '',
        category: '',
        photo: '',
      },
    };
  },

  computed: {
    iconColor() {
      return this.listingBookmarked ? 'danger' : 'grey';
    },
    userSearchLink() {
      return `/search?userId=${this.item.sellerId}`;
    },
    hasExpired() {
      return hasExpired(this.item.expiredAt);
    },
    isSoldOut() {
      return +this.item.quantity === 0 ? true : false;
    },
  },

  async created() {
    const loader = this.$loading.show({ color: 'teal' });
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.listingId = this.$route.params.id;
    await this.retrieveInfo(this.listingId);
    this.listingBookmarked = await isBookmarked(this.listingId, store.getters.getProfileId);
    loader.hide();
  },

  methods: {
    back() {
      router.back();
    },

    checkUser() {
      router.push(`search?userId=${this.item.sellerId}`);
    },

    convertTimestamp(timestamp) {
      return timestamp ? convertTimestamp(timestamp) : null;
    },

    async retrieveInfo(id) {
      const itemDetails = await getListing(id);
      this.item = { ...itemDetails };
      this.seller.name = await getDisplayName(this.item.sellerId);
      const sellerReviews = await getReviews(this.item.sellerId, 'Seller');
      this.seller.rating = await getAggregatedRating(sellerReviews);
    },

    async checkTransactionExists(listingId) {
      const listingTransactions = await getTransactionsByListing(listingId);
      const res = listingTransactions.find((ele) => ele.buyerId === store.getters.getProfileId);
      return res ? true : false;
    },

    async submitTransaction(quantity) {
      const validated = await this.checkTransactionExists(this.listingId);
      if (validated) {
        alert('You cannot make multiple transactions for the same listing!');
        return;
      }
      const transaction = {
        listingId: this.listingId,
        buyerId: store.getters.getProfileId,
        sellerId: this.item.sellerId,
        quantity: quantity,
        createdAt: getCurrentTimestamp(),
      };
      const res = await createTransaction(transaction);
      if (!res) {
        alert('Something went wrong, please try again');
      } else {
        alert('Seller is notified! Seller will contact you soon!');
      }
    },

    async toggleBookmark() {
      const res = await toggleBookmark(this.listingId, store.getters.getProfileId);
      if (!res) {
        alert('Something went wrong, please try again');
      } else {
        this.listingBookmarked = await isBookmarked(this.listingId, store.getters.getProfileId);
      }
    },
  },
};
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  display: block; /* remove extra space below image */
}

div {
  padding-bottom: 1%;
}
</style>
