<template>
    <b-container fluid class="p-4 bg-light">
      <b-row class="my-5">
          <b-img thumbnail fluid :src="photo" alt="Display Photo">
          </b-img>
        <b-col>
          <b-card-text>
            <b-form-rating v-model="averageRating" readonly show-value precision="2" inline></b-form-rating>
          </b-card-text>
          <b-card-text>
            Name: {{ this.profile.name }}
          </b-card-text>
          <b-card-text>
            Role: {{ this.profile.role }}
          </b-card-text>
          <b-card-text>
            Number: {{ this.profile.phoneNumber }}
          </b-card-text>
          <b-card-text>
            Address: {{ this.profile.address }}
          </b-card-text>
        </b-col>
      </b-row>
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
        </b-list-group>

    </b-container>
</template>

<script>

import { getUserProfile } from "@/services/user.service";
import { getReviews, getAggregatedRating } from "@/services/review.service";
import { getDisplayPhoto } from "@/services/user.service";

export default {
  name: "ProfilePage",
  data() {
    return {
      userId: '',
      averageRating: 0,
      profile: {},
      reviews: [],
      photo: '',
    }
  },
  created() {
    this.userId = this.$route.params.id;
  },
  async mounted() {
    this.profile = await getUserProfile(this.userId, false);
    this.photo = await getDisplayPhoto(this.userId);
    this.reviews = await getReviews(this.userId, this.profile?.role);
    for (const review of this.reviews) {
      review.username = await this.getDisplayName(review.userId);
    }
    this.averageRating = getAggregatedRating(this.reviews);
  },
  methods: {
    getDisplayName: async function(userId) {
      const res = await getUserProfile(userId);
      return res.name;
    }
  }
}
</script>

<style scoped>

</style>
