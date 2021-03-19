<template>
  <div>
    
    Transaction Detail Page
    <br><br>
     <b-list-group deck>
      <b-list-group-item  v-for="list in listing"
        v-bind:key="list.id"
        class="d-flex justify-content-between align-items-center">
        <h1>Buyer Name: {{ list.buyerId }}
        <br>
        Quantity: {{ list.quantity }}
        <br> 
        Created at: {{ list.createdAt.toDate().toLocaleDateString() }}
        </h1>
        
            <b-button variant="primary" v-on:click="contact()">
        Contact Buyer
      </b-button>
      </b-list-group-item>

  </b-list-group>

    <br><br>
    
    <b-button v-on:click="back()">Back </b-button>
  </div>
</template>

<script>
import { getTransactions } from "@/services/transaction.service";
import { store } from "@/stores";
import { router } from "@/routes";

export default {
  name: "STransactionDetailPage",
  computed: {
    listing() {
      console.log(store.getters.getList)
      return store.getters.getList;
    },
  },
  async created() {
    const hi = await getTransactions();
    console.log(hi)
  },
  methods: {
    back: function() {
      router.back();
    },
    contact:function() {
      alert("contact buyer at 999")
      //change isApproves to true
      //show buyer contact details or something HOW
    }
  },
}
</script>

<style scoped>

h1 {
  font-family: Century Gothic;
  color:  #cc0044;
  font-size: 16px;
}

button {
  background-color:  #cc0044;
  border-color:  #cc0044;
}

</style>