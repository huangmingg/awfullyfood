<template>
  <div>
    <!--b-container fluid>
    <b-list-group>
      <b-button variant="outline-info" class="ml-auto" v-on:click="addListing()">Create Listing</b-button>
      <hr class="dropdown-divider"/>
      <b-list-group-item
          v-for="(list, index) in listing"
          :key="index"
          class="flex-column align-items-start list-item">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ list.name }}</h5>
          <small> {{ list.createdAt.toDate().toLocaleDateString() }} </small>
        </div>
        <p class="mb-1">
          {{ list.description }}
        </p>
        <small>Expiring at: {{ list.expiredAt.toDate().toLocaleDateString() }}</small>
      </b-list-group-item>
    </b-list-group>
  </b-container-->

    <!--search button-->
    <span class="float-right">
      <div class="input-group">
        <input
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          id="searchEntry"
          v-model.lazy="content"
        />
        <button type="button" class="btn btn-info" v-on:click="search()">
          Search
        </button>
      </div>
    </span>

    <b-button-group>
      <span>
        <SortModal v-on:sortBy="sortContent" />
      </span>

      <span>
        <b-button variant="info" class="ml-auto" v-on:click="addListing()"
          >Create Listing</b-button
        >
      </span>
    </b-button-group>

    <hr class="dropdown-divider" />
    <b-card-group deck>
      <b-card
        v-for="list in getDisplayList()"
        v-bind:key="list.id"
        :title="list.name"
        :img-src="list.imageURL"
        img-alt="Image"
        img-top
        img-height="200"
        img-width="150"
        style="max-width: 20rem"
        class="mb-2 list-item"
        border-variant="info"
        v-on:click="edit(list.id)"
      >
        <b-card-text>
          {{ list.description }}
          <br />
          ${{ list.price }} per {{ list.unit }}
          <br />
          <small
            >Created Date:
            {{ list.createdAt.toDate().toLocaleDateString() }}</small
          >
          <br />
          <small
            >Expiry Date:
            {{ list.expiredAt.toDate().toLocaleDateString() }}</small
          >
        </b-card-text>
        <b-icon-heart-fill style="color: red"></b-icon-heart-fill>
        <span style="color: red">
          {{ list.bookmarks.length }}
        </span>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { store } from "@/stores";
import { getListingBySeller } from "@/services/list.service";
import { router } from "@/routes";
import SortModal from "@/components/SortModal";

export default {
  name: "SListDetailPage",
  components: { SortModal },
  data() {
    return {
      lists: [],
      searchItem: "",
      content: "",
      sortCat: "", //sort category
    };
  },
  computed: {
    listing() {
      return store.getters.getList;
    },
  },
  async created() {
    const res = await getListingBySeller(store.getters.getProfileState?.id);
    console.log(res);
  },
  methods: {
    edit: function (listId) {
      router.push(`list/detail/${listId}`);
    },

    addListing: function () {
      router.push("list/add");
    },

    getDisplayList: function () {
      var lst = this.listing;
      //handle the cross in search bar
      if (this.content == "") {
        this.searchItem = "";
      }

      if (this.searchItem != "") {
        lst = lst.filter((element) =>
          element.name.toUpperCase().includes(this.searchItem.toUpperCase())
        );
      }

      if (this.sortCat != "") {
        lst = this.sorting(lst);
      }

      return lst;
    },
    sortContent(value) {
      this.sortCat = value;
    },
    sorting(list) {
      var newList = this.deepCopy(list);
      switch (this.sortCat) {
        case "price_asc":
          return newList.sort(this.priceComparator);
        case "price_des":
          return newList.sort(this.priceComparator).reverse();
        case "likes_asc":
          return newList.sort(this.likesComparator);
        case "likes_des":
          return newList.sort(this.likesComparator).reverse();
        case "expiry_asc":
          return newList.sort(this.expiryComparator);
        case "expiry_des":
          return newList.sort(this.expiryComparator).reverse();
      }
    },
    priceComparator(a, b) {
      //ascending
      if (a.price > b.price) return 1;
      else if (b.price > a.price) return -1;
      else return 0;
    },

    likesComparator(a, b) {
      //ascending
      if (a.length > b.length) return 1;
      else if (b.length > a.length) return -1;
      else return 0;
    },

    expiryComparator(a, b) {
      //ascending
      if (a.expiredAt.seconds > b.expiredAt.seconds) return 1;
      else if (b.expiredAt.seconds > a.expiredAt.seconds) return -1;
      else return 0;
    },

    deepCopy(list) {
      var newList = [];
      list.forEach((element) => {
        newList.push(element);
      });
      return newList;
    },
    search: function () {
      this.searchItem = document.getElementById("searchEntry").value;
    },
  },
};
</script>

<style scoped>
.list-item:hover {
  background-color:rgb(243, 250, 251);
  background-image: none;
  cursor: pointer;
}

</style>
