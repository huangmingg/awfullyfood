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
            <b-button-group>
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
                v-if="!checkExpire"
                :max-quantity="+item.quantity"
                @createTransaction="createTransaction"
              />
            </b-button-group>
            <b v-show="checkExpire">
              <div
                style="color: red; font-size: 20px"
              >
                Expired!
              </div>
            </b>
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
              Created Date: {{ item.createdAt }}
            </b-card-sub-title>
            <b-card-sub-title class="my-3">
              Expiry Date: {{ item.expiredAt }}
            </b-card-sub-title>
            <div>
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
import { convertTimestamp, getCurrentTimestamp, convertDateString } from '@/services/utils.service';
import { createTransaction } from '@/services/transaction.service';
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

    async retrieveInfo(id) {
      const itemDetails = await getListing(id);
      this.item = {
        ...itemDetails,
        'createdAt': itemDetails.createdAt ? convertTimestamp(itemDetails.createdAt) : null,
        'expiredAt': itemDetails.expiredAt ? convertTimestamp(itemDetails.expiredAt) : null,
      };
      this.seller.name = await getDisplayName(this.item.sellerId);
      const sellerReviews = await getReviews(this.item.sellerId, 'Seller');
      this.seller.rating = await getAggregatedRating(sellerReviews);
    },

    async createTransaction(quantity) {
      // TO-DO: Verify if a buyer can make multiple transactions for the same listing
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

    checkExpire() {
      const expire = convertDateString(this.item.expiredAt);
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
img {
  max-width: 100%;
  max-height: 100%;
  display: block; /* remove extra space below image */
}

div {
  padding-bottom: 1%;
}
</style>
