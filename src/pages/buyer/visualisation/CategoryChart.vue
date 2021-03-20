<template>
  <div class="chart">
    <div class="chartCard" v-if="show">
      <category-chart></category-chart>
    </div>
  </div>
</template>

<script>
import CategoryChart from "./CategoryChart.js";
export default {
  data() {
    return {
      show: true,
    };
  },
  methods: {
    forceUpdate() {
      this.show = true;
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
  components: {
    CategoryChart,
  },
  async created() {
    await this.sleep(500).then(this.forceUpdate);
  },
};
</script>

<style>
</style>