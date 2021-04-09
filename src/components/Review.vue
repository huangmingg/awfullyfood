<template>
  <div>
    <b-card-title>
      Recent Reviews
    </b-card-title>
    <b-list-group>
      <b-list-group-item
        v-for="(review, index) in reviews"
        :key="index"
        class="flex-column align-items-start list-item"
      >
        <div class="d-flex w-100 justify-content-between">
          <p class="mb-1 font-italic">
            "{{ review.description }}"
          </p>
          <small>
            <b-form-rating
              :value="review.rating"
              readonly
              precision="2"
              inline
            />
          </small>
        </div>
        <small> {{ review.username }}, {{ review.updatedAt.toDate().toLocaleDateString() }} </small>
      </b-list-group-item>
      <b-card-text v-show="!reviews.length">
        Oops there are no reviews for this user yet, check back later!
      </b-card-text>
    </b-list-group>
  </div>
</template>
<script>

export default {
  name: 'ReviewVue',
  props: {
    reviews: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>

<style scoped>

</style>
