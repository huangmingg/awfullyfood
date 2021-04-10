<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
    >
      <b-navbar-brand>AwfullyFood</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse
        id="nav-collapse"
        is-nav
      >
        <BuyerHeader v-if="role === 'Buyer'" />
        <SellerHeader v-else-if="role === 'Seller'" />

        <!-- Right aligned nav items -->
        <ProfileHeader v-if="role" />
        <LoginHeader v-else />
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
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
  computed: {
    role() {
      return store.getters.getProfileState?.role;
    },
  },
  methods: {
  },
};
</script>

<style scoped>

</style>
