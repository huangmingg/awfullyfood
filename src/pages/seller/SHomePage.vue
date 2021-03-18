<template>
  <div class="content">
    Seller Home Page
    <ul class="chartCardContainer">
      <li>
        <category-chart></category-chart>
      </li>
      <li>
        <category-chart></category-chart>
      </li>
      <li>
        <category-chart></category-chart>
      </li>
      <li>
        <category-chart></category-chart>
      </li>
    </ul>
  </div>
</template>


<script>
import CategoryChart from "./charts/CategoryChart.vue";
export default {
name: "SHomePage",
  components: {
    CategoryChart,
  },
}
</script>


<style scoped>
#ordersList {
  width: 50%;
  max-width: 100%;
  margin: 10px;
  padding: 0 5px;
  box-sizing: border-box;
}

#listContainer {
  float: left;
  width: 100%;
}

ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
}

li {
  flex-grow: 1;
  flex-basis: 300px;
  text-align: center;
  padding: 10px;

  margin: 10px;
}

button {
  padding: 5px;
  margin: 10px;
}
</style>