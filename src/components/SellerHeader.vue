<template>
  <b-navbar-nav>
    <b-nav-item to="/seller/home" exact exact-active-class="active">Home</b-nav-item>
    <b-nav-item to="/seller/list" exact exact-active-class="active">My Listing</b-nav-item>
    <b-nav-item to="/seller/transaction" exact exact-active-class="active">My Transactions</b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {
  name: "SellerHeader.vue"
}
</script>

<style scoped>

</style>
