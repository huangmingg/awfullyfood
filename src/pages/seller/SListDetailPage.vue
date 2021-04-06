<template>
  <div>
    <b-container
      fluid
      class="p-4 bg-light"
    >
      <b-row>
        <b-button
          variant="info"
          @click="back()"
        >
          Back
        </b-button>

        <b-btn-group class="ml-auto">
          <b-button
            v-show="!edit"
            variant="danger"
            @click="deleteList()"
          >
            Delete Listing
          </b-button>
          <!--expired-->
          <b-button
            v-show="checkExpire()==true"
            variant="info"
            id="expire"
            title="Expired!"
            disabled
          >
            Edit Listing
          </b-button>
           <b-button
            v-show="!edit && checkExpire()==false"
            variant="info"
            @click="editList()"
          >
            Edit Listing
          </b-button>
          <b-button
            v-show="edit"
            variant="info"
            @click="saveList()"
          >
            Save Listing
          </b-button>
        </b-btn-group>
      </b-row>
      <hr class="dropdown-divider">
      <b-form>
        <b-row>
          <b-img
            width="400"
            height="400"
            class="border-info product-photo"
            thumbnail
            fluid
            :src="form.photo"
            alt="Product Photo"
            @click="clickImage()"
          />
          <input
            accept="image/*"
            type="file"
            @change="onFileChange()"
          >
          <b-col>
            <b-form-group
              id="input-group-1"
              label="Product Name:"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="form.name"
                disabled
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Category:"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                v-model="form.category"
                disabled
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Price:"
              label-for="input-3"
            >
              <b-form-input
                id="input-3"
                v-model="form.price"
                disabled
                type="number"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Unit:"
              label-for="input-4"
            >
              <b-form-input
                id="input-4"
                v-model="form.unit"
                disabled
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-5"
              label="Quantity:"
              label-for="input-5"
            >
              <b-form-input
                id="input-5"
                v-model="form.quantity"
                disabled
                type="number"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-6"
              label="Description:"
              label-for="input-6"
            >
              <b-textarea
                id="input-6"
                v-model="form.description"
                disabled
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-9"
              label="Location:"
              label-for="input-9"
            >
              <b-textarea
                id="input-9"
                v-model="form.location"
                disabled
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-7"
              label="Created Date:"
              label-for="input-7"
            >
              <b-form-input
                id="input-7"
                v-model="form.createdAt"
                disabled
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-8"
              label="Expiry Date:"
              label-for="input-8"
            >
              <b-form-input
                id="input-8"
                v-model="form.expiredAt"
                disabled
                type="text"
                required
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <hr>
    </b-container>
  </div>
</template>

<script>
import { router } from '@/routes';
import {
  getListing,
  updateListing,
  getListingPhoto,
  updateListingPhoto,
  deleteListing,
} from '@/services/list.service';

export default {
  name: 'SListPage',
  data() {
    return {
      edit: false,
      editableFields: [
        'input-1',
        'input-3',
        'input-4',
        'input-5',
        'input-6',
        'input-9',
      ],
      form: {
        name: '',
        price: 0,
        quantity: 0,
        unit: '',
        description: '',
        expiredAt: '',
        createdAt: '',
        category: '',
        photo: '',
      },
    };
  },
  computed: {},

  async created() {
    const listingId = this.$route.params.id;
    await getListing(listingId);
    this.retrieveInfo(listingId);
  },
  methods: {
    back() {
      router.back();
    },
    retrieveInfo(id) {
      const itemDetails = getListing(id);
      itemDetails.then((x) => {
        this.form.name = x.name;
        this.form.price = x.price;
        this.form.quantity = x.quantity;
        this.form.unit = x.unit;
        this.form.description = x.description;
        this.form.expiredAt = x.expiredAt.toDate().toLocaleDateString();
        this.form.createdAt = x.createdAt.toDate().toLocaleDateString();
        this.form.category = x.category;
        //error
        this.form.photo = getListingPhoto(id);
        this.form.location = x.location;
      });
    },

    clickImage() {
      this.edit ? document.querySelector('[type="file"]').click() : null;
    },

    async onFileChange() {
      const input = document.querySelector('[type="file"]');
      if (input.files) {
        const listingId = this.$route.params.id;
        await updateListingPhoto(listingId, input.files[0]);
        console.log(getListingPhoto(listingId))
        this.form.photo = await getListingPhoto(listingId);
      }
    },

    editList() {
      console.log('edit');
      this.toggleEdit(true);
    },

    saveList() {
      console.log('save');
      if (!this.validateForm()) {
        alert('Something went wrong, please check the inputs and try again');
        return;
      }
      this.editableFields.forEach(
        (field) => (document.getElementById(field).style = '')
      );
      this.toggleEdit(false);
      // update db
      const change = {
        name: this.form.name,
        price: this.form.price,
        quantity: this.form.quantity,
        unit: this.form.unit,
        description: this.form.description,
        location: this.form.location,
      };
      updateListing(this.$route.params.id, change);
    },

    toggleEdit(isEdit) {
      this.edit = isEdit;
      this.editableFields.forEach((field) => {
        document.getElementById(field).disabled = !isEdit;
      });
    },

    validateForm() {
      let error = false;
      if (this.form.name == '') {
        document.getElementById('input-1').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-1').style.borderColor = '';
      }
      if (this.form.price < 0 || this.form.price == '') {
        document.getElementById('input-3').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-3').style.borderColor = '';
      }
      if (this.form.unit == '') {
        document.getElementById('input-4').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-4').style.borderColor = '';
      }
      if (this.form.quantity <= 0 || this.form.quantity == '') {
        document.getElementById('input-5').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-5').style.borderColor = '';
      }
      if (this.form.description == '') {
        document.getElementById('input-6').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-6').style.borderColor = '';
      }
      if (this.form.location == '') {
        document.getElementById('input-9').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-9').style.borderColor = '';
      }

      if (error) {
        return false;
      }
      return true;
    },
    deleteList: function () {
      deleteListing(this.$route.params.id);
      router.back();
    },
    checkExpire() {
      return (
        new Date(this.form.expiredAt).toLocaleDateString() < new Date().toLocaleDateString()
      );
    },
  },
};
</script>

<style scoped>
.product-photo {
  max-width: 400px;
  max-height: 400px;
}

input[type="file"] {
  display: none;
}

#expire {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
