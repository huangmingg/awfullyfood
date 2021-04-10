<template>
  <div class="content">
    <h5 v-if="role === 'Seller'">
      Sales History
    </h5>
    <h5 v-else>
      Order History
    </h5>
    <hr>
    <b-list-group>
      <b-list-group-item
        v-for="(order) in orders"
        id="list-group"
        :key="order.id"
        class="flex-column align-items-start list-item"
      >
        <transition name="fade">
          <div v-if="role === 'Seller'">
            You sold {{ order.quantity }} {{ order.unit }} of
            {{ order.listName }} to {{ order.buyerName }}!
            <br>Order completed at {{ convertTimestamp(order.completedAt) }}.
            <hr>
          </div>
          <div v-else>
            You saved {{ order.quantity }} {{ order.unit }} of
            {{ order.listName }} from being wasted from {{ order.sellerName }}!
            <br>Order completed at {{ convertTimestamp(order.completedAt) }}.
            <hr>
          </div>
        </transition>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import { convertTimestamp } from '@/services/utils.service';

export default {
  name: 'OrderHistory',
  props: {
    orders: {
      type: Array,
      default: function () {
        return [];
      },
    },
    role: {
      type: String,
      default: function () {
        return 'Seller';
      },
    },
  },
  methods: {
    convertTimestamp(timestamp) {
      return timestamp ? convertTimestamp(timestamp) : null;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#list-group {
  border: none;
}

</style>
