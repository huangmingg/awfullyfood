<template>
    <div>
      <b-button variant="info" class="mr-2" v-b-modal.sort>Sort By</b-button>
      <b-modal v-model="show" id="sort" centered title="Sort By">
        <div class="modal-content">
          <b-form class="modal-body" v-if="show">
              <b-form-radio-group
                  v-model="form.sort"
                  :options="sortOptions"
              ></b-form-radio-group>
          </b-form>
        </div>
        <template v-slot:modal-footer>
          <b-button @click="onReset" variant="info">Reset</b-button>
          <b-button @click="onSubmit" variant="info">Show Results</b-button>
        </template>
      </b-modal>
    </div>
</template>

<script>
export default {
  name: "SortModal.vue",
  data() {
    return {
      show: false,
      form: {
        sort: "",
      },
      sortOptions: [
        {text: 'Price: Ascending', value: 'price_asc'},
        {text: 'Price: Descending', value: 'price_des'},
        {text: 'Likes: Ascending', value: 'likes_asc'},
        {text: 'Likes: Descending', value: 'likes_des'},
        {text: 'Expiry Date: Ascending', value: 'expiry_asc'},
        {text: 'Expiry Date: Descending', value: 'expiry_des'}
        ]
    };
  },
  methods: {
    onSubmit: function() {
      console.log("sorting")
      this.show = false;
      this.$emit('sortBy', this.form.sort)
    },

    onReset: function() {
      this.form = {};
      this.form.sort="";
    },
  }
}
</script>

<style scoped>

</style>
