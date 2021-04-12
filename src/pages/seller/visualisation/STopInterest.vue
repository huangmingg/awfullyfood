<template>
  <div class="content">
    <h5>Most Interested Listings</h5>
    <hr>
    <ul>
      <li
        v-for="list in listings"
        :key="list.id"
      >
        {{ list.quantity }} {{ list.unit }} of {{ list.name }} <br>
        {{ list.interests.length }} interested. <br>
        <b-button
          :id="list.id"
          variant="outline-info"
          @click="route($event)"
        >
          View Listing
        </b-button>
        <hr>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'STopInterests',
  props: {
    listings: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    route(event) {
      const userId = event.target.getAttribute('id');
      this.$router.push({ path: `/seller/list/detail/${userId}` });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
  padding: 1px;
  margin: 5px;
}

button {
  padding: 5px;
  margin: 10px;
}
</style>
