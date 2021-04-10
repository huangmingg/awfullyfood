<template>
  <div>
    <b-button
      v-b-modal.review
      variant="outline-info"
      class="ml-auto"
      :disabled="isDisabled(isApproved)"
    >
      Review
    </b-button>
    <b-modal
      id="review"
      centered
    >
      <template #modal-title>
        Submit Your Review
      </template>
      <div class="d-block text-left">
        Transaction ID: {{ transactionId }} <br><br>
      </div>
      <b-form>
        <b-form-group
          label="Rating"
          label-for="rating-inline"
          :state="ratingState"
          invalid-feedback="Please rate your experience"
        >
          <b-form-rating
            id="rating-inline"
            v-model="form.rating"
            inline
            value="1"
            :state="ratingState"
            no-border
            required
          />
        </b-form-group>
        <b-form-group
          label="Review"
          label-for="review-input"
          :state="descriptionState"
          invalid-feedback="Review is required and must have at least 20 characters"
        >
          <b-form-textarea
            id="review-input"
            v-model="form.description"
            :state="descriptionState"
            required
          />
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <b-button
          variant="info"
          @click="onReset"
        >
          Reset
        </b-button>
        <b-button
          variant="info"
          @click="onSubmit"
        >
          Submit
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: 'ReviewModal',
  props: {
    transactionId: {
      type: String,
      default: function () {
        return '';
      },
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      show: false,
      form: {
        description: '',
        rating: 0,
      },
    };
  },
  computed: {
    ratingState() {
      return this.form.rating > 0;
    },
    descriptionState() {
      return this.form.description?.length > 20;
    },
  },
  methods: {
    onReset() {
      this.form = { description: '', rating: 0 };
    },

    isDisabled(item) {
      return item ? false : true;
    },

    onSubmit() {
      if (this.ratingState && this.descriptionState) {
        this.show = false;
        this.$emit('submitReview', { ...this.form, transactionId: this.transactionId });
      }
    },
  },
};
</script>

<style scoped>

</style>
