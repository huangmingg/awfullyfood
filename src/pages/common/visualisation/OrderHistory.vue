<template>
  <div class="content">
    <h5 v-if="role == 'Seller'">
      Sales History
    </h5>
    <h5 v-else>
      Order History
    </h5>
    <hr>
    <b-list-group>
      <b-list-group-item
        v-for="(order) in orders"
        id="listgroup"
        :key="order.id"
        class="flex-column align-items-start list-item"
      >
        <transition name="fade">
          <div v-if="role == 'Seller'">
            You sold {{ order.quantity }} {{ order.unit }} of
            {{ order.item }} to {{ order.user }}!
            <br>Order completed at {{ order.date.toDate().toLocaleDateString() }}.
            <hr>
          </div>
          <div v-else>
            You saved {{ order.quantity }} {{ order.unit }} of
            {{ order.item }} from being wasted from {{ order.user }}!
            <br>Order completed at {{ order.date.toDate().toLocaleDateString() }}.
            <hr>
          </div>
        </transition>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>

export default {
  name: 'OrderHistory',
  props: {
    orders: {
      type: Array,
      default: function () {
        return []
      },
      role: {
        type: String,
        default: function () {
          return ''
        },
      },
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#listgroup {
  border: none;
}

</style>
