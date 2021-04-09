<template>
  <div>
    <h2>Available Transactions</h2>
    <br>
    <b-list-group deck>
      <b-list-group-item
        v-for="list in unreviewedListings"
        :key="list.id"
        class="d-flex justify-content-between list-group-item-action align-items-center"
      >
        <div>
          <h1 class="mb-3">
            Status: {{ getStatus(list.isApproved) }}
          </h1>
          <h1> Item: {{ list.listName }} </h1>
          <h1> Quantity: {{ list.quantity }} </h1>
          <small>Created at: {{ convertTimestamp(list.createdAt) }}</small>
        </div>
        <b-button-group>
          <b-button
            variant="outline-info"
            class="ml-auto"
            @click="navigate(list.listingId)"
          >
            View Listing
          </b-button>

          <b-button
            variant="outline-info"
            class="ml-auto"
            :disabled="isDisabled(list.isApproved)"
            @click="showModal()"
          >
            Review
          </b-button>
        </b-button-group>

        <b-modal
          id="modal-closing"
          ref="modal-review"
          title="Submit Your Review"

          no-close-on-backdrop
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk($event,list.id)"
        >
          <template #modal-title>
            Submit Your Review
          </template>
          <div class="d-block text-left">
            Transaction ID: {{ list.id }} <br><br>

            <form
              ref="form"
              @submit.stop.prevent="handleSubmit"
            >
              <div>
                <b-form-group
                  label="Rating"
                  label-for="rating-inline"
                  invalid-feedback="Please rate your experience"
                  :state="value > 0"
                >
                  <b-form-rating
                    id="rating-inline"
                    v-model="value"
                    inline
                    value="1"
                    :state="value > 0"
                    no-border
                    required
                  />
                </b-form-group>
              </div>

              <b-form-group
                label="Review"
                label-for="review-input"
                invalid-feedback="Review is required and must have at least 20 characters"
                :state="review.length >= 20"
              >
                <b-form-textarea
                  id="review-input"
                  v-model="review"
                  :state="review.length >= 20"
                  required
                />
              </b-form-group>
            </form>
          </div>
        </b-modal>
      </b-list-group-item>
    </b-list-group>
    <br>
    <div>
      <div style="text-align:center">
        <b-button
          v-b-toggle.collapse-1
          variant="info"
          class="ml-auto"
        >
          Show Past Transactions
        </b-button>
      </div>
      <b-collapse
        id="collapse-1"
        class="mt-2"
      >
        <b-list-group deck>
          <b-list-group-item
            v-for="list in reviewedListings"
            :key="list.id"
            class="d-flex list-group-item-action justify-content-between align-items-center"
          >
            <div>
              <h1> Item: {{ list.listName }} </h1>
              <h1> Quantity: {{ list.quantity }} </h1>
              <small> Reviewed at: {{ convertTimestamp(list.buyerReview.updatedAt) }}</small>
            </div>
            <b-button
              variant="outline-info"
              class="ml-auto"
              @click="navigate(list.listingId)"
            >
              View Listing
            </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { getTransactionsByBuyer, updateBuyerReview } from '@/services/transaction.service';
import { store } from '@/stores';
import { router } from '@/routes';
import { convertTimestamp } from '@/services/utils.service';

export default {
  name: 'BTransactionDetailPage',
  data() {
    return {
      product: {},
      review: '',
      reviewState: null,
      value: 0,
      disabled: false,
      reviewedListings: {},
      unreviewedListings: {},
    };
  },

  computed: {
    listing() {
      return store.getters.getList;
    },
  },

  async created() {
    await getTransactionsByBuyer(store.getters.getProfileState?.id);
  },

  async mounted() {
    const transactions = (
      await getTransactionsByBuyer(store.getters.getProfileState?.id)
    ).filter((ele) => {
      return ele.isApproved === true;
    }).filter((ele) => {
      return ele.buyerReview.size != 0;
    });
    this.reviewedListings = transactions;
    const urtransaction = (
      await getTransactionsByBuyer(store.getters.getProfileState?.id)
    ).filter((ele) => {
      return Object.entries(ele.buyerReview).length === 0;
    });
    this.unreviewedListings = urtransaction;

  },
  methods: {
    checkFormValidity() {
      if (this.value > 0 && this.review.length >= 20) {
        const valid = this.$refs.form[0].checkValidity(); // its an array due to for loop above. so add [0]
        this.reviewState = valid;
        return valid;
      }
      alert('Please fill in your review.');

    },

    convertTimestamp(timestamp) {
      return timestamp ? convertTimestamp(timestamp) : null;
    },

    handleOk(bvModalEvt, id) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit(id);
    },

    resetModal() {
      this.review = '';
      this.reviewState = null;
      this.value = 0;
    },

    handleSubmit(id) {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      updateBuyerReview(id, this.value, this.review);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-closing');
      });
    },

    back() {
      router.back();
    },

    showModal() {
      this.$refs['modal-review'][0].show();
    },

    getStatus: function(item) {
      if (item) {
        return 'Transaction is approved and you can leave a review for the seller.';
      }
      return 'Transaction is not approved.';

    },
    
    isDisabled(item) {
      if (item) {
        return false;
      }
      return true;

    },

    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },
  },

};
</script>

<style scoped>

h1 {
  font-size: 16px;
}

h2 {
  color:  #cc0044;
  font-size: 26px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
}


</style>
