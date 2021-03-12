<template>
  <div>Buyer Home Page</div>
</template>

<script>

import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  name: "BHomePage",
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  }
}
</script>

<style scoped>

</style>
