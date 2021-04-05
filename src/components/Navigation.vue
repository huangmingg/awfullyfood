<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand>AwfullyFood</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <BuyerHeader v-if="role === 'Buyer'"/>
        <SellerHeader v-else-if="role === 'Seller'"/>

        <!-- Right aligned nav items -->
        <ProfileHeader v-if="role"/>
        <LoginHeader v-else/>
<!--        <b-navbar-nav class="ml-auto">-->
<!--          <b-nav-item-dropdown right>-->
<!--            <template #button-content>-->
<!--              <em>Welcome, {{ name }}!</em>-->
<!--            </template>-->
<!--            <b-dropdown-item to="/">Profile</b-dropdown-item>-->
<!--            <b-dropdown-item v-on:click="signOut()">Sign Out</b-dropdown-item>-->
<!--          </b-nav-item-dropdown>-->
<!--        </b-navbar-nav>-->
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
// import { signOut } from "@/services/auth.service";
import { store } from '@/stores';
import BuyerHeader from '@/components/BuyerHeader';
import SellerHeader from '@/components/SellerHeader';
import ProfileHeader from '@/components/ProfileHeader';
import LoginHeader from '@/components/LoginHeader';

export default {
  name: 'Navigation',
  components: {
    BuyerHeader, SellerHeader, ProfileHeader, LoginHeader,
  },
  methods: {
    // signOut: function() {
    //   signOut();
    // }
  },
  computed: {
    // name () {
    //   return store.getters.getProfileState?.name;
    // },
    role() {
      return store.getters.getProfileState?.role;
    },
  },
};
</script>

<style scoped>

</style>
