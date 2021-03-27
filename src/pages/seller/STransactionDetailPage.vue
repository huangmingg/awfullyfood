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
          <b-dropdown-item v-on:click="contact()">Contact Buyer</b-dropdown-item>
          <b-dropdown-item v-on:click="approve(list.id)">Approve Transaction</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-list-group-item>

  </b-list-group>

    <br><br>
    
    <b-button v-on:click="back()">Back </b-button>
  </div>
</template>

<script>
import { getTransactionsBySeller, approveTransaction } from "@/services/transaction.service";
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
    const res = await getTransactionsBySeller(store.getters.getProfileState?.id); //change to getTransactionsBySeller
    console.log(res);
  },
  methods: {
    back: function() {
      router.back();
    },
    contact:function() {
      alert("contact buyer at 999")
      //show buyer contact details 
    },
    approve:function(id) {
      alert("approve transaction")
      approveTransaction(id); 
      //router.push('list/add');
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