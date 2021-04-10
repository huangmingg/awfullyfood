<template>
  <div>
    <b-button
      v-b-modal.quantity
      variant="outline-info"
      class="ml-auto"
    >
      I'm Interested!
    </b-button>
    <b-modal
      id="quantity"
      centered
      v-model="show"
    >
      <template #modal-title>
        Select your quantity
      </template>
      <div class="d-block text-left">
        The maximum quantity is {{ maxQuantity }}
      </div>
      <b-form>
        <b-form-group
          label="Quantity"
          label-for="quantity-input"
        >
          <b-form-input
            id="quantity-input"
            v-model="quantity"
            type="number"
            :state="quantityState"
            required
          />
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
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
  name: 'QuantityModalVue',
  props: {
    maxQuantity: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      show: false,
      quantity: 0,
    };
  },
  computed: {
    quantityState() {
      return (+this.quantity > 0 && +this.quantity <= this.maxQuantity) ? true : false;
    },
  },
  methods: {
    onSubmit() {
      if (this.quantityState) {
        this.show = false;
        this.$emit('createTransaction', this.quantity);
      }
    },
  },
};
</script>

<style scoped>
</style>
