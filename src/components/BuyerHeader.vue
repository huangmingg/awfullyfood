<template>
  <b-navbar-nav>
    <b-nav-item to="/buyer/home" exact exact-active-class="active">Home</b-nav-item>
    <b-nav-item to="/buyer/browse" exact exact-active-class="active">Browse</b-nav-item>
    <b-nav-item to="/buyer/bookmark" exact exact-active-class="active">My Bookmark</b-nav-item>
  </b-navbar-nav>
</template>

<script>
export default {
  name: "BuyerHeader.vue"
}
</script>

<style scoped>

</style>
