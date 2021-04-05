<template>
  <div>
    <h1>Available Transactions</h1><br>

    <b-list-group deck>
      <b-list-group-item
        v-for="list in listing"
        :key="list.id"
        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        @click="navigate(list.id)"
      >
        {{ list.name }}<br>
        >> {{ list.description }}
      </b-list-group-item>
    </b-list-group>

    <br><br>
  </div>
</template>

<script>
import { getListingBySeller } from '@/services/list.service';
import { store } from '@/stores';
import { router } from '@/routes';

export default {
  name: 'STransactionPage',
  computed: {
    listing() {
      return store.getters.getList;
    },
  },

  async created() {
    const res = await getListingBySeller(store.getters.getProfileState?.id);
    console.log(res);
  },

  methods: {
    navigate(transactionId) {
      router.push(`transaction/${transactionId}`);
    },
  },
};
</script>

<style scoped>

h1 {
  color:  #cc0044;
  font-size: 26px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
}

</style>
