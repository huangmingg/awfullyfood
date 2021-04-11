<template>
  <div>
    <b-container
      fluid
      class="p-4 bg-light"
    >
      <b-row class="mx-2">
        <b-button
          variant="info"
          @click="back()"
        >
          Back
        </b-button>

        <b-btn-group class="ml-auto" v-if="!hasExpired">
          <b-button
            v-show="!edit"
            style="border-radius: 5px"
            variant="info"
            @click="editList()"
          >
            Edit Listing
          </b-button>
          <b-button
            v-show="edit"
            style="border-radius: 5px"
            variant="info"
            @click="onSubmit()"
          >
            Save Listing
          </b-button>
        </b-btn-group>
      </b-row>
      <hr class="dropdown-divider">
      <b-form class="mx-3">
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
                :state="nameState"
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
              id="input-group-5"
              label="Quantity:"
              label-for="input-5"
            >
              <b-form-input
                id="input-5"
                v-model="form.quantity"
                :state="quantityState"
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
              <b-form-textarea
                id="input-6"
                v-model="form.description"
                :state="descriptionState"
                disabled
                type="text"
                required
              />
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group
              id="input-group-4"
              label="Unit:"
              label-for="input-4"
            >
              <b-form-select
                id="input-4"
                v-model="form.unit"
                required
                disabled
                :options="units"
              />
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Category:"
              label-for="input-2"
            >
              <b-form-select
                id="input-2"
                v-model="form.category"
                required
                disabled
                :options="categories"
              />
            </b-form-group>

            <b-form-group
              id="input-group-7"
              label="Created Date:"
              label-for="input-7"
            >
              <b-form-datepicker
                id="input-7"
                v-model="form.createdAt"
                disabled
                date
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-8"
              label="Expiry Date:"
              label-for="input-8"
            >
              <b-form-datepicker
                id="input-8"
                v-model="form.expiredAt"
                disabled
                date
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
import { getListing, updateListing, getListingPhoto, updateListingPhoto, deleteListing } from '@/services/list.service';
import {
  convertTimestamp,
  convertDateObject,
  convertDateString,
  getCurrentTimestamp,
} from '@/services/utils.service';

export default {
  name: 'SListPage',
  data() {
    return {
      listingId: '',
      edit: false,
      editableFields: ['input-1', 'input-5', 'input-6'],
      categories: ['Ugly', 'Expiring'],
      units: ['Carton', 'Kg', 'Box', 'Gram', 'Pax'],
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
  computed: {
    descriptionState() {
      return this.edit ? this.form.description?.length > 10 ? true : false : null;
    },
    nameState() {
      return this.edit ? this.form.name?.length > 2 ? true : false : null;
    },
    quantityState() {
      return this.edit ? +this.form.quantity > 0 ? true : false : null;
    },
    hasExpired() {
      return this.form.expiredAt < Date.now();
    },
  },

  async created() {
    const loader = this.$loading.show({ color: 'teal' });
    this.listingId = this.$route.params.id;
    await this.retrieveInfo(this.listingId);
    loader.hide();
  },

  methods: {
    back() {
      router.back();
    },

    async retrieveInfo(id) {
      const itemDetails = await getListing(id);
      this.form = {
        ...itemDetails,
        'createdAt': itemDetails.createdAt ? convertTimestamp(itemDetails.createdAt, false) : null,
        'expiredAt': itemDetails.expiredAt ? convertTimestamp(itemDetails.expiredAt, false) : null,
      };
    },

    clickImage() {
      this.edit ? document.querySelector('[type="file"]').click() : null;
    },

    async onFileChange() {
      const input = document.querySelector('[type="file"]');
      if (input.files) {
        const listingId = this.$route.params.id;
        await updateListingPhoto(listingId, input.files[0]);
        this.form.photo = await getListingPhoto(listingId);
      }
    },

    editList() {
      this.toggleEdit(true);
    },

    async onSubmit() {
      if (!this.validateForm()) {
        alert('Something went wrong, please check the inputs and try again');
        return;
      }
      this.toggleEdit(false);
      const res = await updateListing(this.listingId, {
        ...this.form,
        createdAt: this.form.createdAt ? convertDateObject(this.form.createdAt) : null,
        expiredAt: this.form.expiredAt ? convertDateObject(this.form.expiredAt) : null,
      });
      if (!res) {
        alert('Something went wrong with updating the listing, please try again!');
      } else {
        this.back();
      }
    },

    toggleEdit(isEdit) {
      this.edit = isEdit;
      this.editableFields.forEach((field) => {
        document.getElementById(field).disabled = !isEdit;
      });
    },

    validateForm() {
      if (!this.descriptionState || !this.quantityState || !this.nameState) {
        return false;
      }
      return true;
    },

    async deleteList () {
      const res = await deleteListing(this.$route.params.id);
      res ? router.back() : alert('Something went wrong, please try again!');
    },

    checkExpire() {
      const expire = convertDateString(this.form.expiredAt);
      const expired_s = expire.seconds;
      const expired_ns = expire.nanoseconds;
      const curr_s = getCurrentTimestamp().seconds;
      const curr_ns = getCurrentTimestamp().nanoseconds;
      if (expired_s < curr_s || (expired_s == curr_s && expired_ns < curr_ns)) {
        return true;
      } else {
        return false;
      }
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
