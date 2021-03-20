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
        
        <b-button variant="outline-info" class="ml-auto" v-on:click="contact()">Contact Buyer</b-button>
      
      </b-list-group-item>

  </b-list-group>

    <br><br>
    
    <b-button v-on:click="back()">Back </b-button>
  </div>
</template>

<script>
import { getTransactionsBySeller } from "@/services/transaction.service";
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
    const res = await getTransactionsBySeller(); //change to getTransactionsBySeller
    console.log(res);
  },
  methods: {
    back: function() {
      router.back();
    },
    contact:function() {
      alert("contact buyer at 999")
      //change isApproves to true
      //show buyer contact details or something HOW
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