<template>
  <div>
    <b-button
      v-b-modal.sort
      variant="info"
      class="mr-2"
    >
      Sort By
    </b-button>
    <b-modal
      id="sort"
      v-model="show"
      centered
      title="Sort By"
    >
      <div class="modal-content">
        <b-form class="modal-body">
          <b-form-radio-group
            v-model="form.sort"
            :options="sortOptions"
          />
        </b-form>
      </div>
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
          Show Results
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'SortModalVue',
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
        { text: 'Expiry: Desc', value: [['expiredAt', 'seconds'], -1] },
      ],
    };
  },
  methods: {
    onSubmit() {
      this.show = false;
      this.$emit('sortListing', this.form.sort);
    },

    onReset() {
      this.form = { sort: [['expiredAt', 'seconds'], 1] };
    },
  },
};

</script>

<style scoped>

</style>
