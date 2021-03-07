<template>
  <b-container class="login-container">
    <b-row>
      <b-col>
        <div id="firebase-auth-container">
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>

import { auth, authService } from "@/firebase";
const firebaseui = require('firebaseui');
import "firebaseui/dist/firebaseui.css";
import { isUserRegistered } from "@/services/user.service";

export default {
  name: 'Login',
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
    let self = this;
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(authService);
    }
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult) {
          const successResponse = async () => {
            const userId = authResult.user.uid;
            const userRegistered = await isUserRegistered(userId);
            if (!userRegistered) {
              await self.$router.push('/register');
            } else {
              console.log("registered")
              await self.$router.push('/');
            }
          }

          successResponse()
        },
      },
      signInFlow: "popup",
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
      ]
    };
    ui.start("#firebase-auth-container", uiConfig);
  }
}
</script>

<style scoped>

.login-container {
  border: 3px dashed black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20%;
  width: 20%;
}


</style>
