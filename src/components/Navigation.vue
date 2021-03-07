<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">AwfullyFood</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" exact exact-active-class="active">Home</b-nav-item>
          <b-nav-item to="/browse" exact exact-active-class="active">Browse</b-nav-item>
          <b-nav-item to="/history" exact exact-active-class="active">History</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>Welcome, Jamie!</em>
            </template>
            <b-dropdown-item to="/">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
name: "Navigation"
}
</script>

<style scoped>

</style>
