<template>
  <div class="content">
    <h5>Pending Orders</h5>
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
            You have a pending order of {{ order.quantity }} {{ order.unit }} of
            {{ order.listName }} for {{ order.buyerName }}!
            <br>Order created at {{ convertTimestamp(order.createdAt) }}.
            <hr>
          </div>
          <div v-else>
            You have a pending order of {{ order.quantity }} {{ order.unit }} of
            {{ order.listName }} from {{ order.sellerName }}!
            <br>Order created at {{ convertTimestamp(order.createdAt) }}.
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
  name: 'PendingOrders',
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
        return '';
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
