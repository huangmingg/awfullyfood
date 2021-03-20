<template>
  <div>
    <!--filter button-->
    <span>
      <b-button variant="info" class="mr-2" v-b-modal.filter>Filter</b-button>
      <b-modal id="filter" centered title="Filters">
        <div class="modal-content">
          <div class="modal-body">
            <b> Item Category </b>
            <br />
            <!-- need clear the array upon creation of the page??-->
            <div
              class="form-check form-check-inline"
              v-on:click="updateCategory('Expiring')"
            >
              <input
                class="form-check-input"
                type="checkbox"
                id="Expiring"
                value="Expiring"
              />
              <label class="form-check-label" for="Expiring">Expiring</label>
            </div>
            <div
              class="form-check form-check-inline"
              v-on:click="updateCategory('Ugly')"
            >
              <input
                class="form-check-input"
                type="checkbox"
                id="Ugly"
                value="Ugly"
              />
              <label class="form-check-label" for="Ugly">Ugly</label>
            </div>

            <div>
              <b>Date Posted</b>
              <br />
              <div
                class="form-check form-check-inline"
                v-on:click="getDate('Anytime')"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="Anytime"
                  value="anytime"
                />
                <label class="form-check-label" for="Anytime">Anytime</label>
              </div>
              <div
                class="form-check form-check-inline"
                v-on:click="getDate('Past 24 hours')"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="Past 24 hours"
                  value="oneDay"
                />
                <label class="form-check-label" for="Past 24 hours"
                  >Past 24 hours</label
                >
              </div>
              <div
                class="form-check form-check-inline"
                v-on:click="getDate('Past Week')"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="Past Week"
                  value="oneWeek"
                />
                <label class="form-check-label" for="Past Week"
                  >Past Week</label
                >
              </div>
              <div
                class="form-check form-check-inline"
                v-on:click="getDate('Past 2 weeks')"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="Past 2 weeks"
                  value="twoWeek"
                />
                <label class="form-check-label" for="Past 2 weeks"
                  >Past 2 weeks</label
                >
              </div>
              <div
                class="form-check form-check-inline"
                v-on:click="getDate('Past Month')"
              >
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="Past Month"
                  value="pastMth"
                />
                <label class="form-check-label" for="Past Month"
                  >Past Month</label
                >
              </div>
            </div>

            <!-- issue with dropdown-->
            <div>
              <b>Discount</b>
              <div class="dropdown">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenu2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                  <li>
                    <button class="dropdown-item" type="button">Action</button>
                  </li>
                  <li>
                    <button class="dropdown-item" type="button">
                      Another action
                    </button>
                  </li>
                  <li>
                    <button class="dropdown-item" type="button">
                      Something else here
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <template v-slot:modal-footer>
          <b-button @click="resetFn()" variant="info">Reset</b-button>
          <!--not able to close the modal-->
          <b-button data-dismiss="modal" aria-hidden="true" variant="info"
            >Show Results</b-button
          >
        </template>
      </b-modal>
    </span>

    <!--sort button-->
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

    <!--search button problem: unable to show listing upon clearing search input-->
    <span class="float-right">
      <div class="input-group">
        <input
          type="search"
          class="form-control rounded"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-addon"
          id="searchEntry"
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
        v-for="list in listing"
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

export default {
  name: "BBrowsePage",
  data() {
    return {
      itemCategory: [],
      datePosted: "",
      discount: "",
      searchItem: "",
    };
  },
  computed: {
    listing() {
      var lst = store.getters.getList;
      if (this.itemCategory.length == 1) {
        //if both expiring and ugly are checked, lst is still the same
        for (var i = 0; i < this.itemCategory.length; i++) {
          lst = lst.filter((x) => x.category === this.itemCategory[i]);
        }
      }

      if (this.searchItem.length !== 0) {
        
        lst = lst.filter((x) => x.name.search(this.searchItem) !== -1);
        console.log(lst)
      }
      //return store.getters.getList;
      return lst;
    },
  },
  created() {
    getListings();
  },

  methods: {
    navigate: function (listId) {
      router.push(`browse/${listId}`);
    },
    //set filter's datePosted
    getDate: function (date) {
      this.datePosted = date;
    },
    resetFn: function () {
      document
        .getElementsByClassName("form-check-input")
        .forEach((x) => (x.checked = false));
      this.itemCategory = [];
      this.datePosted = "";
      this.discount = "";
    },
    showResultsFn: function () {
      console.log("will show result");
    },
    updateCategory: function (itemCat) {
      if (this.itemCategory.includes(itemCat)) {
        //remove itemCat
        var tempLst = [];
        for (var i = 0; i < this.itemCategory.length; i++) {
          if (this.itemCategory[i] !== itemCat) {
            tempLst.push(this.itemCategory[i]);
          }
        }
        this.itemCategory = tempLst;
      } else {
        //add
        this.itemCategory.push(itemCat);
      }
    },
    search: function () {
      this.searchItem = document.getElementById("searchEntry").value;
    },
  },
};
</script>

<style scoped>
input {
  display: inline-block;
}
</style>
