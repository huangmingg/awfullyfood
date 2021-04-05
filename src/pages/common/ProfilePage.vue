<template>
  <div>
    <b-container fluid class="p-4 bg-light">
      <b-row>
        <b-btn-group class="ml-auto" >
          <b-button v-show="!edit" variant="outline-info" v-on:click="editProfile()">Edit Profile</b-button>
          <b-button v-show="edit" variant="info" v-on:click="saveProfile()">Save Profile</b-button>
        </b-btn-group>
      </b-row>
      <b-form>
        <b-row>
          <b-img @click="clickImage()" width=400 height=400 class="border-info profile-photo" thumbnail fluid :src="photo" alt="Display Photo"/>
          <input accept="image/*" v-on:change="onFileChange()" type="file"/>
          <b-col>
            <b-card-text>
              <span class="mr-2 font-weight-bolder">
                {{ form.role }}
              </span>
              <b-form-rating v-model="averageRating" readonly show-value precision="2" inline></b-form-rating>
            </b-card-text>

            <b-form-group id="input-group-1" label="Email:" label-for="input-1">
              <b-form-input
                  disabled
                  id="input-1"
                  v-model="form.email"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Display Name:" label-for="input-2">
              <b-form-input
                  disabled
                  id="input-2"
                  v-model="form.name"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Phone Number:" label-for="input-3">
              <b-form-input
                  disabled
                  id="input-3"
                  v-model="form.phoneNumber"
                  type="number"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Address:" label-for="input-4">
              <b-form-input
                  disabled
                  id="input-4"
                  v-model="form.address"
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

import { store } from '@/stores';
import {
  getUserProfile, getDisplayPhoto, updateDisplayPhoto, updateUser,
} from '@/services/user.service';
import { authService } from '@/firebase';
import { getAggregatedRating, getReviews } from '@/services/review.service';
import Review from '@/components/Review';

export default {
  name: 'EditProfilePage',
  components: { Review },
  data() {
    return {
      edit: false,
      editableFields: ['input-2', 'input-3', 'input-4'],
      file: '',
      imageInput: '',
      averageRating: 0,
      reviews: [],
      photo: '',
      form: {
        id: '',
        email: '',
        name: '',
        phoneNumber: '',
        address: '',
        role: '',
      },
    };
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
    this.reviews = await getReviews(store.getters.getProfileState.id, this.form?.role);
    this.averageRating = getAggregatedRating(this.reviews);
  },

  methods: {
    editProfile() {
      this.toggleEdit(true);
    },

    async saveProfile() {
      if (!this.validateForm()) {
        alert('Something went wrong, please check the input and try again');
        return;
      }
      this.toggleEdit(false);
      await updateUser(this.form.id, this.form);
      await getUserProfile(authService.currentUser.uid);
    },

    toggleEdit(isEdit) {
      this.edit = isEdit;
      this.editableFields.forEach((field) => {
        document.getElementById(field).disabled = !isEdit;
      });
    },

    validateForm() {
      return true;
    },

    clickImage() {
      this.edit ? document.querySelector('[type="file"]').click() : null;
    },

    async onFileChange() {
      const input = document.querySelector('[type="file"]');
      if (input.files) {
        await updateDisplayPhoto(this.form.id, input.files[0]);
        this.photo = await getDisplayPhoto(this.form.id);
      }
    },

  },
};
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
