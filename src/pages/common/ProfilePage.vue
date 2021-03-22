<template>
  <div>
    <b-container fluid class="p4 bg-light">
      <b-row class="mx-2">
        <b-card-text>
          Search user by name
        </b-card-text>
        <b-input-group>
          <b-form-input
              id="search-user"
              placeholder="qwe">
          </b-form-input>
        </b-input-group>
      </b-row>
    </b-container>
    <hr/>
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
          <input type="file" />
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
                  type="email"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Display Name:" label-for="input-3">
              <b-form-input
                  disabled
                  id="input-3"
                  v-model="form.name"
                  type="text"
                  placeholder="Enter name"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Phone Number:" label-for="input-4">
              <b-form-input
                  disabled
                  id="input-4"
                  v-model="form.phoneNumber"
                  placeholder="Enter phone number"
                  type="number"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Address:" label-for="input-5">
              <b-form-input
                  disabled
                  id="input-5"
                  v-model="form.address"
                  placeholder="Enter phone number"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-text>
              Role: {{ form.role }}
            </b-form-text>
          </b-col>
        </b-row>
      </b-form>

      <b-card-title>
        Recent Reviews
      </b-card-title>
      <b-list-group >
        <b-list-group-item
            v-for="(review, index) in reviews"
            v-bind:key="index"
            class="flex-column align-items-start list-item"
        >
          <div class="d-flex w-100 justify-content-between">
            <p class="mb-1 font-italic"> "{{ review.description }}" </p>
            <small>
              <b-form-rating :value="review.rating" readonly precision="2" inline></b-form-rating>
            </small>
          </div>
          <small> {{ review.username }}, {{ review.updatedAt.toDate().toLocaleDateString() }} </small>
        </b-list-group-item>
        <b-card-text v-show="!reviews.length">
          Oops there are no reviews for this user yet, check back later!
        </b-card-text>
      </b-list-group>
    </b-container>
  </div>

</template>

<script>

import { store } from "@/stores";
import {getUserProfile, registerUser, updateDisplayPhoto} from "@/services/user.service";
import { authService } from "@/firebase";
import {router} from "@/routes";
import {getAggregatedRating, getReviews} from "@/services/review.service";

export default {
  name: "EditProfilePage",
  data() {
    return {
      averageRating: 0,
      reviews: [],
      userId: '',
      photo: 'http://picsum.photos/400/600/?image=82',
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
  },
  async mounted() {
    this.form = { ...store.getters.getProfileState };

    const img = document.querySelector('img');
    img.addEventListener('click', function () {
      document.querySelector('[type="file"]').click();
      // console.log("image clicked")
    })
    console.log(img);
    this.reviews = await getReviews(this.userId, this.profile?.role);
    for (const review of this.reviews) {
      review.username = await this.getDisplayName(review.userId);
    }
    this.averageRating = getAggregatedRating(this.reviews);

  },
  methods: {
    submitButton: async function(file) {
      await updateDisplayPhoto(this.userId, file);
      // console.log(file);
    },
    async onSubmit(event) {
      event.preventDefault();
      const res = await registerUser(this.userId, this.form);
      if (!res) {
        alert("Something went wrong, please try again!")
      } else {
        this.form.role === 'Buyer' ? await router.push('/buyer') : await router.push('/seller');
      }
    },
    editProfile() {

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
