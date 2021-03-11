<template>
  <div>Home Page</div>
</template>

<script>

import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  name: "Home",
  async created() {
    console.log("init home")
    if (!store.getters.getProfileState) {
      console.log("recalling api")
      await getUserProfile(authService.currentUser.uid);
    } else {
      console.log(store.getters.getProfileState.name)
    }
  }
}
</script>

<style scoped>

</style>
