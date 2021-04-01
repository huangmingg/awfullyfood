<template>
  <div>
    <b-button v-on:click="back()" variant="info">Back </b-button>
    <hr class="dropdown-divider" />
    
    <b-container fluid class="p-4 bg-light">
      <b-row>
        <b-btn-group class="ml-auto" >
          <b-button v-show="!edit" variant="info" v-on:click="editList()">Edit Listing</b-button>
          <b-button v-show="edit" variant="info" v-on:click="saveList()">Save Listing</b-button>
        </b-btn-group>
      </b-row>
      <b-form>
        <b-row>
          <b-img @click="clickImage()" width=400 height=400 class="border-info product-photo" thumbnail fluid :src="form.photo" alt="Product Photo"/>
          <input accept="image/*" v-on:change="onFileChange()" type="file"/>
          <b-col>
            <b-form-group id="input-group-1" label="Product Name:" label-for="input-1">
              <b-form-input
                  disabled
                  id="input-1"
                  v-model="form.name"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Category:" label-for="input-2">
              <b-form-input
                  disabled
                  id="input-2"
                  v-model="form.category"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Price:" label-for="input-3">
              <b-form-input
                  disabled
                  id="input-3"
                  v-model="form.price"
                  type="number"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Unit:" label-for="input-4">
              <b-form-input
                  disabled
                  id="input-4"
                  v-model="form.unit"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Quantity:" label-for="input-5">
              <b-form-input
                  disabled
                  id="input-5"
                  v-model="form.quantity"
                  type="number"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-6" label="Description:" label-for="input-6">
              <b-form-input
                  disabled
                  id="input-6"
                  v-model="form.description"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-7" label="Created Date:" label-for="input-7">
              <b-form-input
                  disabled
                  id="input-7"
                  v-model="form.createdAt"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-8" label="Expiry Date:" label-for="input-8">
              <b-form-input
                  disabled
                  id="input-8"
                  v-model="form.expiredAt"
                  type="text"
                  required
              ></b-form-input>
            </b-form-group>

          </b-col>
        </b-row>
      </b-form>
      <hr/>
    </b-container>
  </div>
</template>

<script>
import { router } from "@/routes";
import { getListing, updateListing } from "@/services/list.service";
import { getListingPhoto, updateListingPhoto } from "@/services/user.service";

export default {
  name: "SListPage",
  data() {
    return {
      edit: false,
      editableFields: ["input-1", "input-3", "input-4", "input-5", "input-6"],
      form: {
        name:"",
        price:0,
        quantity:0,
        unit:"",
        description:"",
        expiredAt:"",
        createdAt:"",
        category:"",
        photo:''
      }
    }
  },
  computed: {
  },
  async created() {
    const listingId = this.$route.params.id;
    this.retrieveInfo(listingId);
  },
  methods: {
    back: function() {
      router.back();
    },
    retrieveInfo: function(id) {
      const itemDetails = getListing(id);
      itemDetails.then((x) => {
        this.form.name= x.name;
        this.form.price=x.price;
        this.form.quantity=x.quantity;
        this.form.unit=x.unit;
        this.form.description=x.description;
        this.form.expiredAt=x.expiredAt.toDate().toLocaleDateString();
        this.form.createdAt=x.createdAt.toDate().toLocaleDateString(); 
        this.form.category=x.category;
        this.form.photo=x.imageURL
      })
    },

    clickImage: function() {
      this.edit ? document.querySelector('[type="file"]').click() : null;
    },

    onFileChange: async function() {
      const input = document.querySelector('[type="file"]');
      if (input.files) {
        const listingId = this.$route.params.id;
        await updateListingPhoto(listingId, input.files[0]);
        this.photo = await getListingPhoto(listingId);
      }
    },

    editList: function() {
      console.log("edit")
      this.toggleEdit(true);
    },

    saveList: function() {
      console.log("save");
      if (!this.validateForm()) {
        alert("Something went wrong, please check the inputs and try again");
        return;
      }
      this.editableFields.forEach((field) => document.getElementById(field).style="")
      this.toggleEdit(false);
      //update db
      var change = {
        name: this.form.name,
        price: this.form.price,
        quantity: this.form.quantity,
        unit: this.form.unit,
        description: this.form.description
      }
      updateListing(this.$route.params.id, change)
    },

    toggleEdit: function(isEdit) {
      this.edit = isEdit;
      this.editableFields.forEach((field) => {
        document.getElementById(field).disabled = !isEdit;
      });
    },

    validateForm: function() {
      var error=false;
      if (this.form.name == "") {
        document.getElementById("input-1").style.borderColor="red"
        error=true
      } else {
        document.getElementById("input-1").style.borderColor=""
      }
      if (this.form.price < 0 || this.form.price == "" ) {
        document.getElementById("input-3").style.borderColor="red"
        error=true
      } else {
        document.getElementById("input-3").style.borderColor=""
      }
      if (this.form.unit == "") {
        document.getElementById("input-4").style.borderColor="red"
        error=true
      } else {
        document.getElementById("input-4").style.borderColor=""
      }
      if (this.form.quantity <= 0 || this.form.quantity == "" ) {
        document.getElementById("input-5").style.borderColor="red"
        error=true
      } else {
        document.getElementById("input-5").style.borderColor=""
      }
      if (this.form.description == "") {
        document.getElementById("input-6").style.borderColor="red"
        error=true
      } else {
        document.getElementById("input-6").style.borderColor=""
      }

      if (error) {
        return false
      } else {
      return true;
      }
    },
  },
}
</script>

<style scoped>
.product-photo {
  max-width: 400px;
  max-height: 400px;
}

input[type="file"] {
  display: none;
}
</style>
