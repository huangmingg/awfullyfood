<template>
  <div>
    <b-button-group>
      <BrowseModal v-on:filterBy="filterContent" v-on:filterDate="dateFilter"/>
      <span>
      <b-button variant="info" v-b-modal.sortBy>Sort By</b-button>
      <b-modal id="sortBy" centered title="Sort By">
        <div class="modal-content">
          <div class="form-check form-check-inline">
            <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="ascendingPrice"
                value="ascendingPrice"
            />
            <label class="form-check-label" for="ascendingPrice"
            >Ascending Price</label
            >
          </div>
          <div class="form-check form-check-inline">
            <input
                class="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="descendingPrice"
                value="descendingPrice"
            />
            <label class="form-check-label" for="descendingPrice"
            >Descending Price</label
            >
          </div>
        </div>
      </b-modal>
    </span>

    </b-button-group>

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
        <button
          type="button"
          class="btn btn-outline-primary"
          v-on:click="search()"
        >
          search
        </button>
      </div>
    </span>

    <br /><br />

    <!--listing-->
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
        class="mb-2"
        border-variant="primary"
      >
        <b-card-text>
          {{ list.description }}
        </b-card-text>

        <b-button variant="primary" v-on:click="navigate(list.id)">
          View More
        </b-button>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { getListings } from "@/services/list.service";
import { store } from "@/stores";
import { router } from "@/routes";
import BrowseModal from "@/components/BrowseModal";

export default {
  name: "BBrowsePage",
  components: { BrowseModal },
  data() {
    return {
      itemCategory: [],
      datePosted: "",
      searchItem: "",
      content:"",
      reset:false
    };
  },
   computed: {
    listing() {
      return store.getters.getList; //get listings from store
    },
  }, 
  created() {
    getListings();  //store listings in store
  },

  methods: {
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },
    search: function () {
      this.searchItem = document.getElementById("searchEntry").value;
    },
    findDiffInDate: function(a) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      //discard time and time-zone information
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var today = new Date();
      const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    },
    getDisplayList: function() {
      var lst = this.listing;
      //handle the cross in search bar
      if (this.content == "") {
        this.searchItem=""
      }
    

      if (this.searchItem != "") {
        lst=lst.filter(element => element.name.toUpperCase().includes(this.searchItem.toUpperCase()))
      }

      if (this.itemCategory.length != 0) {
        if (this.itemCategory.length != 2) {
          //only one category selected
          //if both selected, return original lst
          lst=lst.filter(element => element.category == this.itemCategory[0])
        }
      }

      
      if (this.datePosted != "") {
        lst=this.filterByDate(lst, this.datePosted)
      }

      return lst;
    },
    filterContent (value) {
      this.itemCategory=value[0];
      this.datePosted=value[1];
    },
    dateFilter (day) {
      this.datePosted = day;
    },
    filterByDate (currList, daysToFilter) {
      return currList.filter(element => this.findDiffInDate(new Date(element.createdAt.seconds*1000)) <= daysToFilter);
    },
  },
};
</script>

<style scoped>
input {
  display: inline-block;
}
</style>
