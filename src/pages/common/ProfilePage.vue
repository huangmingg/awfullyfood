<template>
  <div>Profile Page</div>
</template>

<script>

import {store} from "@/stores";
import {getUserProfile} from "@/services/user.service";
import {authService} from "@/firebase";

export default {
  name: "ProfilePage",
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  }
}
</script>

<style scoped>

</style>
