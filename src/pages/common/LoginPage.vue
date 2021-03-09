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
import { router } from "@/routes";

const firebaseui = require('firebaseui');
import "firebaseui/dist/firebaseui.css";
import { isUserRegistered, getUserRole } from "@/services/user.service";

export default {
  name: 'Login',
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
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
              await router.push('/register');
            } else {
              const role = await getUserRole(userId);
              switch (role) {
                case 'buyer':
                  await router.push('/home');
                  break;
                case 'seller':
                  await router.push('/seller-home');
                  break;
                default:
                  await router.push('/register');
                  break;
              }
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
