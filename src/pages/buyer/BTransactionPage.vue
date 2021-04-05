<template>
  <div>
    
    <h2>Available Transactions</h2>
    <br>
     <b-list-group deck>
      <b-list-group-item  v-for="list in thirdListing"
        v-bind:key="list.id" 
        class="d-flex justify-content-between list-group-item-action align-items-center" >
        <h1 class="mb-1">Status: {{ getStatus(list.isApproved) }}<br>
        {{ list.productName }} -> This should be the name.
        <br>
        Quantity: {{ list.quantity }}
        <br> 
        <small>Created at: {{ list.createdAt.toDate().toLocaleDateString() }}</small>
        </h1>

        <b-button-group>
        <b-button variant="outline-info" class="ml-auto" v-on:click="navigate(list.listingId)">View Listing</b-button> 
        
        <b-button variant="outline-info" class="ml-auto" @click="showModal()" :disabled="isDisabled(list.isApproved)">Review</b-button>
        </b-button-group>

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
                  invalid-feedback="Review is required and must have at least 20 characters"
                  :state="review.length >= 20"
                >
                <b-form-textarea
                  id="review-input"
                  v-model="review"
                  :state="review.length >= 20"
                  required
                ></b-form-textarea> 
                </b-form-group>
              </form>          
            </div>
            </b-modal>

        
      </b-list-group-item>
  </b-list-group>
  <br>
  <div>
    <div style="text-align:center">
    <b-button v-b-toggle.collapse-1 variant="info" class="ml-auto">Show Past Transactions</b-button>
    </div>
    <b-collapse id="collapse-1" class="mt-2">
          
        <b-list-group deck>
            <b-list-group-item  v-for="list in secondListing"
              v-bind:key="list.id"
              class="d-flex list-group-item-action justify-content-between align-items-center">
              <h1 class="mb-1"><small>Item: {{ list.listingId }} This should be name too.<br>
              Quantity: {{ list.quantity }}<br>
              Reviewed at: {{ list.buyerReview.updatedAt }}</small>
              </h1>
               <b-button variant="outline-info" class="ml-auto" v-on:click="navigate(list.listingId)">View Listing</b-button> 
              
          </b-list-group-item>
        </b-list-group>

    </b-collapse>
  </div>

  </div>
</template>

<script>
import { getTransactionsByBuyer, updateBuyerReview } from "@/services/transaction.service";
import { getListing } from "@/services/list.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  data() {
    return {
      product: {},
      review: '', 
      reviewState: null,
      value: 0, 
      disabled: false,
      secondListing: {},
      thirdListing: {},
      test: '',
    }
  },
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  async created() {
    const res = await getTransactionsByBuyer(store.getters.getProfileState?.id); 
    console.log(res)
  },
  async mounted() {
    const transactions = (
      await getTransactionsByBuyer(store.getters.getProfileState?.id)
    ).filter((ele) => {
      return ele.isApproved === true;
    }).filter((ele) => {
      return ele.buyerReview.size != 0;
    })
    this.secondListing = transactions;
    const transactions2 = (
      await getTransactionsByBuyer(store.getters.getProfileState?.id)
    ).filter((ele) => {
      return Object.entries(ele.buyerReview).length === 0;
    })
    this.thirdListing = transactions2;

  },
  methods: {
    checkFormValidity() {
    if (this.value > 0 && this.review.length >= 20) { 
        const valid = this.$refs.form[0].checkValidity() //its an array due to for loop above. so add [0]
        this.reviewState = valid
        return valid
      } else {
        alert('Please fill in your review.')
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
        return 'Transaction is approved and you can leave a review for the seller.'
      } else {
        return 'Transaction is not approved.'
      }
    },
    isDisabled:function(item){
      if (item) {
        return false
      } else {
        return true
      }        
    },
    getProduct: async function(id) {
      this.product = await getListing(id)
      console.log(this.product)
      return this.product.name
    },
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },
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