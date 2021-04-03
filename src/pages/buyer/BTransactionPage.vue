<template>
  <div>
    
    <h2>Available Transactions</h2>
    <br>
     <b-list-group deck>
      <b-list-group-item  v-for="list in listing"
        v-bind:key="list.id" 
        class="d-flex justify-content-between list-group-item-action align-items-center">
        <h1 class="mb-1">Status: {{ getStatus(list.isApproved) }}
        <br><br>
        {{ list.listingId }}
        <br>
        Quantity: {{ list.quantity }}
        <br> 
        <small>Created at: {{ list.createdAt.toDate().toLocaleDateString() }}</small>
        </h1>

        <b-button variant="outline-info" class="ml-auto" @click="showModal()" :disabled="isDisabled">Review</b-button>


          <b-modal id="modal-closing" ref="modal-review" 
          title="Submit Your Review"
          
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk($event,list.id)"
          no-close-on-backdrop
          >
            <template #modal-title>
              Submit Your Review
            </template>
            <div class="d-block text-left">
              Transaction ID: {{list.id}} <br><br>

              <form ref="form" @submit.stop.prevent="handleSubmit">
              <div>
              <b-form-group
                label="Rating"
                label-for="rating-inline"
                invalid-feedback="Please rate your experience"
                :state="value > 0"
              >
              <b-form-rating id="rating-inline" 
              inline value="1" 
              v-model="value" 
              :state="value > 0" 
              no-border
              required></b-form-rating>
              </b-form-group>
              </div>
            
                <b-form-group
                  label="Review"
                  label-for="review-input"
                  invalid-feedback="Review is required and must have at least 10 characters"
                  :state="review.length >= 10"
                >
                <b-form-textarea
                  id="review-input"
                  v-model="review"
                  :state="review.length >= 10"
                  required
                ></b-form-textarea> 
                </b-form-group>
              </form>          
            </div>
            </b-modal>

        
      </b-list-group-item>

  </b-list-group>

  </div>
</template>

<script>
import { getTransactionsByBuyer, updateBuyerReview } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  data() {
    return {
      profile: {},
      review: '', 
      reviewState: null,
      value: 0, 
      disabled: false,
    }
  },
  computed: {
    listing() {
      return store.getters.getList;
    },
    isDisabled() {
      return this.disabled;
    }
  },
  async created() {
    const res = await getTransactionsByBuyer(store.getters.getProfileState?.id); 
    console.log(res)
  },
  methods: {
    checkFormValidity() {
      if (this.value > 0) { 
        const valid = this.$refs.form[0].checkValidity() //its an array due to for loop above. so add [0]
        this.reviewState = valid
        return valid
      }
    },
    handleOk(bvModalEvt,id) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit(id)
    },
    resetModal() {
      this.review = ''
      this.reviewState = null
      this.value = 0
    },
    handleSubmit(id) { 
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      updateBuyerReview(id,this.value,this.review)  
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-closing')
      })
    },
    back: function() {
      router.back();
    },
    showModal(){
        this.$refs["modal-review"][0].show();
    },
    getStatus:function(item) {
      if (item) {
        this.disabled = false
        return 'Transaction is approved and you can leave a review for the seller.'
      } else {
        this.disabled = true
        return 'Transaction is not approved.'
      }
    }
  },
  
}
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