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

          <b-modal id="bv-modal-example" hide-footer>
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
import { getTransactionsBySeller, approveTransaction } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  data() {
    return {
      profile: {},
      name: '',
      nameState: null,
      submittedNames: []
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
    checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
    },
    resetModal() {
        this.name = ''
        this.nameState = null
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
      this.submittedNames.push(this.name)
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
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