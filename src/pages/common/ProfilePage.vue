<template>
  <div>
    <b-container fluid class="p-4 bg-light">
      <b-row>
        <b-btn-group class="ml-auto" >
          <b-button variant="outline-info" v-on:click="editProfile()">Edit Profile</b-button>
          <b-button variant="outline-info" v-on:click="saveProfile()">Save Profile</b-button>
        </b-btn-group>
      </b-row>
      <b-form @submit="onSubmit">
        <b-row>
          <b-img width=400 height=400 class="border-info profile-photo" thumbnail fluid :src="photo" alt="Display Photo"/>
          <input type="file"/>
          <b-col>
            <b-form-group id="input-group-1" label="Unique ID" label-for="input-1">
              <b-form-input
                  disabled
                  id="input-1"
                  v-model="form.id"
                  type="text"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Email:" label-for="input-2">
              <b-form-input
                  disabled
                  id="input-2"
                  v-model="form.email"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Display Name:" label-for="input-3">
              <b-form-input
                  disabled
                  id="input-3"
                  v-model="form.name"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Phone Number:" label-for="input-4">
              <b-form-input
                  disabled
                  id="input-4"
                  v-model="form.phoneNumber"
                  type="number"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Address:" label-for="input-5">
              <b-form-input
                  disabled
                  id="input-5"
                  v-model="form.address"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-6" label="Role:" label-for="input-5">
              <b-form-input
                  disabled
                  id="input-5"
                  v-model="form.role"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <hr/>
      <Review v-bind:reviews="reviews"/>
    </b-container>
  </div>

</template>

<script>

import { store } from "@/stores";
import { getUserProfile, registerUser, getDisplayPhoto } from "@/services/user.service";
import { authService } from "@/firebase";
import { router } from "@/routes";
import { getAggregatedRating, getReviews } from "@/services/review.service";
import Review from "@/components/Review";

export default {
  name: "EditProfilePage",
  components: { Review },
  data() {
    return {
      imageInput: '',
      averageRating: 0,
      reviews: [],
      userId: '',
      photo: '',
      form: {
        id: '',
        email: '',
        name: '',
        phoneNumber: '',
        address: '',
        role: '',
        photo: '',
      },
    }
  },

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.imageInput = document.querySelector('img');
  },

  async mounted() {
    this.form = { ...store.getters.getProfileState };
    this.photo = await getDisplayPhoto(this.form?.id);
    this.reviews = await getReviews(this.form?.id, this.form?.role);
    this.averageRating = getAggregatedRating(this.reviews);
  },

  methods: {
    onSubmit: async function(event) {
      event.preventDefault();
      const res = await registerUser(this.userId, this.form);
      if (!res) {
        alert("Something went wrong, please try again!")
      } else {
        this.form.role === 'Buyer' ? await router.push('/buyer') : await router.push('/seller');
      }
    },

    editProfile: function() {
      this.imageInput.addEventListener('click', function () {
        document.querySelector('[type="file"]').click();
      });
    },

    saveProfile: function() {
      this.imageInput.removeEventListener('click',function () {
        document.querySelector('[type="file"]').click();
      });
    }
  }
}
</script>

<style scoped>

.profile-photo {
  max-width: 400px;
  max-height: 400px;
}

input[type="file"] {
  display: none;
}
</style>
