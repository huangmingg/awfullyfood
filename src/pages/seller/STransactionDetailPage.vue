<template>
  <div>
    
    <h2>Transaction Details</h2>
    <br>
     <b-list-group deck>
      <b-list-group-item  v-for="list in listing"
        v-bind:key="list.id"
        class="d-flex justify-content-between align-items-center">
        <h1 class="mb-1">Buyer Name: {{ list.buyerId }}
        <br>
        Quantity: {{ list.quantity }}
        <br> 
        <small>Created at: {{ list.createdAt.toDate().toLocaleDateString() }}</small>
        </h1>
        
        
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right>
          <template #button-content>
            Actions
          </template>
        <div>
          <b-dropdown-item id="show-btn" @click="$bvModal.show('bv-modal-example')" v-on:click="contact(list.buyerId)">Contact Buyer</b-dropdown-item>

          <b-modal id="bv-modal-example" no-close-on-backdrop hide-header hide-footer>
            <template #modal-title>
              Contact Buyer
            </template>
            <div class="d-block text-center">
              <h1>Here are the buyer details:<br><br>
               Name: {{ profile.name }}<br>
               Contact No: {{ profile.phoneNumber }} <br>
               Email: {{ profile.email }}
               </h1> 
            </div>
            <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
          </b-modal>
          
        <b-dropdown-item @click="showModal()" v-on:click="approve(list.id)">Approve</b-dropdown-item>

          <b-modal id="modal-closing" ref="modal-review" 
          title="Submit Your Review"
          
          @show="resetModal"
          @hidden="resetModal"
          @ok="handleOk"
          no-close-on-backdrop >
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
                  :state="text.length >= 10"
                >
                <b-form-textarea
                  id="review-input"
                  v-model="text"
                  :state="text.length >= 10"
                  required
                ></b-form-textarea> 
                </b-form-group>
              </form>          
            </div>
            </b-modal>

        </div>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-list-group-item>

  </b-list-group>

    <br><br>
    
    <b-button v-on:click="back()">Back </b-button>
  </div>
</template>

<script>

import { getUserProfile } from "@/services/user.service";
import { getTransactionsBySeller, approveTransaction, testUpdateQuantity } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  data() {
    return {
      profile: {},
      name: '',
      nameState: null,
      submittedNames: [],
      text: '', //need to reset text if not its the same for all. ensure text is sent to right db.
      textState: null,
      value: 0, //need to send to db.
    }
  },
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  async created() {
    const res = await getTransactionsBySeller(store.getters.getProfileState?.id); //change to getTransactionsBySeller
    console.log(res);
  },
  methods: {
    checkFormValidity() {
      if (this.value > 0) { 
        const valid = this.$refs.form[0].checkValidity() //its an array due to for loop above. so add [0]
        this.textState = valid
        return valid
      }
    },
    resetModal() {
      this.text = ''
      this.textState = null
      this.value = 0
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() { 
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Push the name to submitted names 
      this.submittedNames.push(this.text) //This shall be edited to be sent to firebase data. or not.
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-closing')
      })
    },
    back: function() {
      router.back();
    },
    contact: async function(id) {
      this.profile = await getUserProfile(id, false);
      console.log(this.profile);
    },
    approve:function(id) {
      approveTransaction(id); 
    },
    submitThis:function(id) {
      testUpdateQuantity(id);
    },
    showModal(){
        this.$refs["modal-review"][0].show();
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