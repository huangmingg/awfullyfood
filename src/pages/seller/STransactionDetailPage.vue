<template>
  <div>
    <h2>Pending Transactions</h2>
    <b-list-group deck>
      <b-list-group-item
        v-for="list in pendingListings"
        :key="list.id"
        class="d-flex justify-content-between align-items-center"
      >
        <h1 class="mb-1">
          Buyer ID: {{ list.buyerId }}<br>
        
          Quantity: {{ list.quantity }}<br>
          <small>Created at: {{ list.createdAt.toDate().toLocaleDateString() }}</small>
        </h1>


        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              Actions
            </template>
            <div>
              <b-dropdown-item
                id="show-btn"
                @click="$bvModal.show('bv-modal-example'); contact(list.buyerId)"
              >
                Contact Buyer
              </b-dropdown-item>

              <b-modal
                id="bv-modal-example"
                no-close-on-backdrop
                hide-header
                hide-footer
              >
                <template #modal-title>
                  Contact Buyer
                </template>
                <div class="d-block text-center">
                  <h1>
                    Here are the buyer details:<br><br>
                    Name: {{ profile.name }}<br>
                    Contact No: {{ profile.phoneNumber }} <br>
                    Email: {{ profile.email }}
                  </h1>
                </div>
                <b-button
                  class="mt-3"
                  block
                  @click="$bvModal.hide('bv-modal-example')"
                >
                  Close Me
                </b-button>
              </b-modal>

              <b-dropdown-item @click="showModal()">
                Approve
              </b-dropdown-item>

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
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
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
          Show Approved Transactions
        </b-button>
      </div>
      <b-collapse
        id="collapse-1"
        class="mt-2"
      >
        <h2>Approved Transactions</h2>
        <b-list-group deck>
          <b-list-group-item
            v-for="list in approvedListings"
            :key="list.id"
            class="d-flex justify-content-between align-items-center"
            disabled
          >
            <h1 class="mb-1">
              <small>ID: {{ list.buyerId }}<br>
                Quantity: {{ list.quantity }}<br>
                Approved at: {{ list.sellerReview.updatedAt }}</small>
            </h1>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </div>


    <br><br>

    <b-button @click="back()">
      Back
    </b-button>
  </div>
</template>

<script>

import { getUserProfile } from '@/services/user.service';
import {
  getApprovedTransactionsBySeller, getPendingTransactionsBySeller, approveTransaction, updateSellerReview,
} from '@/services/transaction.service';
import { store } from '@/stores';
import { router } from '@/routes';

export default {
  name: 'STransactionDetailPage',
  data() {
    return {
      profile: {},
      review: '',
      reviewState: null,
      value: 0, 
      pendingListings: {},
      approvedListings: {},
    };
  },
  computed: {
  },
  async created() {
    this.pendingListings = await getPendingTransactionsBySeller(store.getters.getProfileState?.id); 
    this.approvedListings = await getApprovedTransactionsBySeller(store.getters.getProfileState?.id);
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
    resetModal() {
      this.review = '';
      this.reviewState = null;
      this.value = 0;
    },
    handleOk(bvModalEvt, id) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit(id);
    },
    handleSubmit(id) {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Update Firebase Data
      approveTransaction(id);
      updateSellerReview(id, this.value, this.review);

      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-closing');
        // location.reload() //can only updateReview and get into approve part after several REFRESHES
      });
    },
    back() {
      router.back();
    },
    async contact(id) {
      this.profile = await getUserProfile(id, false);
      console.log(this.profile);
    },
    showModal() {
      this.$refs['modal-review'][0].show();
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
