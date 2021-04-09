<template>
  <div>
    <b-modal
      id="qty"
      v-model="show"
      centered
      title="Quantity"
    >
      The maximum quantity is {{ maxQuantity }}.
      <b-form class="modal-body">     
        <b-form-group
          id="qtyInput-label"
          label="Quantity:"
          label-for="qtyInput"
        >
          <b-form-input
            id="qtyInput"
            v-model="itemQty"
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
      show: true,
      itemQty: 0,
    };
  },
  computed: {
    quantityState() {
      return (+this.itemQty > 0 && +this.itemQty <= this.maxQuantity) ? true : false;
    },
  },
  methods: {
    onSubmit() {
      if (this.validate()) {
        this.show = false;
        this.qty();
      }
    },
    qty() {
      const res = this.itemQty;
      this.$emit('quantity', res);
    },
    validate() {
      if (this.itemQty <= 0 || this.itemQty > this.maxQuantity) {
        document.getElementById('qtyInput').style.borderColor = 'red';
        alert('Something went wrong, please check the inputs and try again');
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
</style>