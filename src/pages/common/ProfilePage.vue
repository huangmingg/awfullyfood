<template>
  <div>
    <p>
      Name: {{ this.profile.name }}
    </p>
    <p>
      Role: {{ this.profile.role }}
    </p>
    <p>
      Number: {{ this.profile.phoneNumber }}
    </p>
  </div>
</template>

<script>

import { getUserProfile } from "@/services/user.service";

export default {
  name: "ProfilePage",
  data() {
    return {
      userId: '',
      profile: {},
    }
  },
  created() {
    this.userId = this.$route.params.id;
  },
  async mounted() {
    this.profile = await getUserProfile(this.userId, false);
  }
}
</script>

<style scoped>

</style>
