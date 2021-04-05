<template>
    <div>
      <b-button variant="info" class="mr-2" v-b-modal.filter>Filter</b-button>
      <b-modal v-model="show" id="filter" centered title="Filters">
        <div class="modal-content">
          <b-form class="modal-body">
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
  name: 'BrowseModal.vue',
  data() {
    return {
      show: false,
      form: {
        category: ['Ugly', 'Expiring'],
        datePosted: 0,
      },
      categories: ['Ugly', 'Expiring'],
      dateOptions: [
        { text: 'Anytime', value: 0 },
        { text: 'Past 24 Hours', value: 86400 },
        { text: 'Past Week', value: 7 * 86400 },
        { text: 'Past 2 Weeks', value: 14 * 86400 },
        { text: 'Past Month', value: 30 * 86400 },
      ],
    };
  },
  methods: {
    onSubmit() {
      this.show = false;
      this.filterListing();
    },

    onReset() {
      this.form = { category: ['Ugly', 'Expiring'], datePosted: 0 };
    },

    filterListing() {
      const res = this.sanitizeForm();
      this.$emit('filterListing', res);
    },

    sanitizeForm() {
      const output = {};
      if (this.form.datePosted) {
        output.datePosted = this.form.datePosted;
      }
      output.itemCategory = this.form.category;
      return output;
    },
  },
};
</script>

<style scoped>

</style>
