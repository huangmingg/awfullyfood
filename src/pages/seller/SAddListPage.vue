<template>
  <div>
    <b-button
      variant="info"
      @click="back()"
    >
      Back
    </b-button>
    <hr class="dropdown-divider">
    <b-card-title class="font-weight-bold ml-2">
      Add a new listing
    </b-card-title>
    <b-container
      fluid
      class="p-4 bg-light"
    >
      <b-form @submit="onSubmit">
        <b-row>
          <b-img
            width="400"
            height="400"
            class="border-info product-photo"
            thumbnail
            fluid
            :src="photo.source"
            alt="Product Photo"
            @click="clickImage()"
          />
          <input
            accept="image/*"
            type="file"
            @change="onFileChange"
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
                type="text"
                :state="nameState"
                required
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
                :options="categories"
                :state="unitState"
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
                type="number"
                :state="priceState"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-4"
              label="Unit:"
              label-for="input-4"
            >
              <b-form-select
                id="input-4"
                v-model="form.unit"
                :options="units"
                :state="unitState"
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
                type="number"
                :state="quantityState"
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
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-7"
              label="Expiry Date:"
              label-for="input-7"
            >
              <b-form-datepicker
                id="input-7"
                v-model="form.expiredAt"
                date
                required
                :state="expireState"
                :min="minDate"
              />
            </b-form-group>

            <b-button
              class="float-right"
              variant="info"
              type="submit"
            >
              Create
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { router } from '@/routes';
import { createListing, getDummyPhoto, updateListingPhoto } from '@/services/list.service';
import { store } from '@/stores';
import { authService } from '@/firebase';
import { getUserProfile } from '@/services/user.service';
import { convertDateString } from '@/services/utils.service';

export default {
  name: 'SAddListPageVue',
  data() {
    return {
      selectedPhoto: false,
      photo: {
        source: '',
        location: '',
      },
      form: {
        name: '',
        price: '',
        quantity: '',
        unit: 'Carton',
        description: '',
        expiredAt: '',
        category: 'Expiring',
      },
      minDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
      categories: ['Ugly', 'Expiring'],
      units: ['Carton', 'Kg', 'Ml', 'Box', 'Gram', 'Pax'],
    };
  },
  computed: {
    descriptionState() {
      return this.form.description?.length > 10 ? true : false;
    },
    nameState() {
      return this.form.name?.length > 2 ? true : false;
    },
    priceState() {
      return +this.form.price > 0 ? true : false;
    },
    quantityState() {
      return +this.form.quantity > 0 ? true : false;
    },
    unitState() {
      return this.form.unit ? true : false;
    },
    expireState() {
      return this.form.expiredAt ? true : false;
    },
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    this.photo.source = await getDummyPhoto();
  },
  methods: {
    back() {
      router.back();
    },

    clickImage() {
      document.querySelector('[type="file"]').click();
    },

    onFileChange(event) {
      this.selectedPhoto = true;
      this.photo = { source: '', location: '' };
      if (event.target.files) {
        const file = event.target.files[0];
        this.photo.location = file;
        if (!file.type.match('image.*')) {
          return;
        }
        let reader = new FileReader();
        reader.onload = (event) => {
          this.photo.source = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async onSubmit(event) {
      event.preventDefault();
      const payload = { ...this.form, sellerId: store.getters.getProfileId, expiredAt: convertDateString(this.form.expiredAt) };
      const [res, listingId] = await createListing(payload);
      if (!res) {
        alert('Something went wrong, please check the fields and try again');
      } else {
        this.selectedPhoto ? await updateListingPhoto(listingId, this.photo.location) : null;
        this.back();
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


</style>
