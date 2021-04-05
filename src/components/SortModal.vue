<template>
    <div>
      <b-button variant="info" class="mr-2" v-b-modal.sort>Sort By</b-button>
      <b-modal v-model="show" id="sort" centered title="Sort By">
        <div class="modal-content">
          <b-form class="modal-body">
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
        sort: [['expiredAt', 'seconds'], 1],
      },
      sortOptions: [
        { text: 'Price: Asc', value: [['price'], 1] },
        { text: 'Price: Desc', value: [['price'], -1] },
        { text: 'Created: Asc', value: [['createdAt', 'seconds'], 1] },
        { text: 'Created: Desc', value: [['createdAt', 'seconds'], -1] },
        { text: 'Expiry: Asc', value: [['expiredAt', 'seconds'], 1] },
        { text: 'Expiry: Desc', value: [['expiredAt', 'seconds'], -1] }
        ]
    };
  },
  methods: {
    onSubmit: function() {
      this.show = false;
      this.$emit('sortListing', this.form.sort)
    },

    onReset: function() {
      this.form = { sort: [['expiredAt', 'seconds'], 1] };
    },
  }
}

</script>

<style scoped>

</style>
