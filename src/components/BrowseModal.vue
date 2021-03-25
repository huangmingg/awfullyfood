<template>
    <div>
      <b-button variant="info" class="mr-2" v-b-modal.filter>Filter</b-button>
      <b-modal v-model="show" id="filter" centered title="Filters">
        <div class="modal-content">
          <b-form class="modal-body" v-if="show">
            <b-form-group label="Item Category:">
              <b-form-checkbox-group
                  v-model="form.category"
                  :options="categories"
                  :values="categories"
              ></b-form-checkbox-group>
            </b-form-group>
            <b-form-group label="Date Posted">
              <b-form-radio-group
                  v-model="form.datePosted"
                  :options="dateOptions"
              ></b-form-radio-group>
            </b-form-group>
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
  name: "BrowseModal.vue",
  data() {
    return {
      show: false,
      form: {
        category: [],
        datePosted: "",
      },
      categories: ['Ugly', 'Expiring'],
      dateOptions: ['Anytime', 'Past 24 Hours', 'Past Week', 'Past 2 Weeks', 'Past Month']
    };
  },
  methods: {
    onSubmit: function() {
      console.log("Submitting form")
      this.show = false;
      this.$emit('filterBy', [this.form.category, this.form.datePosted])
    },

    onReset: function() {
      this.form = {};
    },
  }
}
</script>

<style scoped>

</style>
