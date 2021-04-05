<template>
  <b-container class="register-component">
    <b-form @submit="onSubmit" v-if="show">
      <p class="text-justify"> Welcome! Tell us a little more about yourself</p>

      <b-form-group id="input-group-1" label="Your Email:" label-for="input-1">
        <b-form-input
            disabled
            id="input-1"
            v-model="form.email"
            type="email"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Display Name:" label-for="input-2">
        <b-form-input
            id="input-2"
            v-model="form.name"
            type="text"
            placeholder="Enter name"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Your Phone Number:" label-for="input-3">
        <b-form-input
            id="input-3"
            v-model="form.phoneNumber"
            placeholder="Enter phone number"
            type="number"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Your Address:" label-for="input-4">
        <b-form-input
            id="input-4"
            v-model="form.address"
            placeholder="Enter phone number"
            type="text"
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Select Your Role:" v-slot="{ ariaDescribedby }">
        <b-form-radio-group
            v-model="form.role"
            :options="roles"
            :aria-describedby="ariaDescribedby"
            name="radio-options"
        ></b-form-radio-group>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>
  </b-container>
</template>

<script>
import { registerUser, getUserProfile } from '@/services/user.service';
import { router } from '@/routes';

import { authService } from '@/firebase';

export default {
  name: 'RegistrationPage',
  props: ['authResult'],
  data() {
    return {
      userId: '',
      form: {
        email: '',
        name: '',
        phoneNumber: '',
        address: '',
        role: 'Buyer',
      },
      roles: ['Buyer', 'Seller'],
      show: true,
    };
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      const res = await registerUser(this.userId, this.form);
      if (!res) {
        alert('Something went wrong, please try again!');
      } else {
        this.form.role === 'Buyer' ? await router.push('/buyer') : await router.push('/seller');
      }
    },

    initProps() {
      // TO-DO Create a mapper for authResult objects returned from the various providers
      if (this.authResult?.user) {
        this.userId = this.authResult.user.uid;
        this.form.email = this.authResult.user.email;
        this.form.name = this.authResult.user.displayName;
        this.form.phoneNumber = this.authResult.user.phoneNumber;
      }
    },
  },

  async created() {
    if (!this.authResult) {
      const res = await getUserProfile(authService.currentUser.uid);
      this.userId = res.uid;
      this.form.email = res.email;
      this.form.name = res.name;
      this.form.phoneNumber = res.phoneNumber;
    }
  },

  mounted() {
    this.initProps();
  },
};
</script>

<style scoped>

</style>
