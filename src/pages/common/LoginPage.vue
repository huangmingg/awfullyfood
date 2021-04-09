<template>
  <b-container style="margin-top: 10%;">
    <b-card
      img-right
      :img-src="require(`@/assets/images/login_page.jpeg`)"
    >
      <b-card-title>
        AwfullyFood
      </b-card-title>
      <hr>
      <b-card-text class="mb-5">
        Select Your Preferred Login Method
      </b-card-text>
      <div id="firebase-auth-container" />
    </b-card>
  </b-container>
</template>
<script>

import { auth, authService } from '@/firebase';
import { router } from '@/routes';
import 'firebaseui/dist/firebaseui.css';
import { isUserRegistered, getUserProfile } from '@/services/user.service';


const firebaseui = require('firebaseui');

export default {
  name: 'Login',
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(authService);
    }
    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult(authResult) {
          const successResponse = async () => {
            const userId = authResult.user.uid;
            const userRegistered = await isUserRegistered(userId);
            if (!userRegistered) {
              await router.push({ name: 'register', params: { authResult } });
            } else {
              const profile = await getUserProfile(userId);
              switch (profile?.role) {
              case 'Buyer':
                await router.push('/buyer');
                break;
              case 'Seller':
                await router.push('/seller');
                break;
              default:
                await router.push({ name: 'register', params: { authResult } });
                break;
              }
            }
          };
          successResponse();
        },
      },
      signInFlow: 'popup',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.EmailAuthProvider.PROVIDER_ID,
      ],
    };
    ui.start('#firebase-auth-container', uiConfig);
  },
};
</script>

<style scoped>

.login-container {
  /*background-color: #3ca2b9;*/
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: center;*/
  margin-top: 10%;
  /*width:20%;*/
}


</style>
