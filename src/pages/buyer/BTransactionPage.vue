<template>
  <div>
    
    <h2>Available Transactions</h2>
    <br>
     <b-list-group deck>
      <b-list-group-item  v-for="list in listing"
        v-bind:key="list.id" 
        class="d-flex justify-content-between list-group-item-action align-items-center">
        <h1 class="mb-1">Transaction Status: {{ list.isApproves }}
        <br><br>
        {{ list.listingId }}
        <br>
        Quantity: {{ list.quantity }}
        <br> 
        <small>Created at: {{ list.createdAt.toDate().toLocaleDateString() }}</small>
        </h1>
        
        <b-button variant="outline-info" class="ml-auto" v-on:click="contact()">Contact Seller</b-button>
      
      </b-list-group-item>

  </b-list-group>

  </div>
</template>

<script>
import { getTransactionsByBuyer } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  async created() {
    const res = await getTransactionsByBuyer(store.getters.getProfileState?.id); //change to getTransactionsByBuyer
    console.log(res)
  },
  methods: {
    back: function() {
      router.back();
    },
    contact:function() {
      alert("contact seller at 999")
      //show seller contact details or something HOW
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