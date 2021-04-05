<template>
  <div>
    <b-button
      variant="info"
      @click="back()"
    >
      Back
    </b-button>
    <hr class="dropdown-divider">
    <p class="headerFont">
      Create a new listing
    </p>
    <b-container
      fluid
      class="p-4 bg-light"
    >
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
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Category:"
              label-for="input-2"
            >
              <b-form-radio-group
                id="input-2"
                v-model="form.category"
                :options="options"
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
                type="number"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-6"
              label="Description:"
              label-for="input-6"
            >
              <b-form-input
                id="input-6"
                v-model="form.description"
                type="text"
                required
              />
            </b-form-group>

            <b-form-group
              id="input-group-7"
              label="Expiry Date:"
              label-for="input-7"
            >
              <b-form-input
                id="input-7"
                v-model="form.expiredAt"
                type="datetime-local"
                required
              />
            </b-form-group>

            <b-button
              class="float-right"
              variant="info"
              @click="create()"
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
import { createListing, getListingPhoto, updateListingPhoto } from '@/services/list.service';
import { store } from '@/stores';
import { authService } from '@/firebase';
import { getUserProfile } from '@/services/user.service';

export default {
  name: 'SAddListPageVue',
  data() {
    return {
      form: {
        name: '',
        price: '',
        quantity: '',
        unit: '',
        description: '',
        expiredAt: '',
        category: '',
        photo: '',
      },
      options: ['Ugly', 'Expiring'],
    };
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
  },
  methods: {
    back() {
      router.back();
    },
    clickImage() {
      document.querySelector('[type="file"]').click();
    },

    async onFileChange() {
      const input = document.querySelector('[type="file"]');
      if (input.files) {
        const listingId = this.$route.params.id;
        await updateListingPhoto(listingId, input.files[0]);
        this.form.photo = await getListingPhoto(listingId);
      }
    },
    validate() {
      let error = false;
      if (this.form.name == '') {
        document.getElementById('input-1').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-1').style.borderColor = '';
      }
      if (this.form.category == '') {
        document.getElementById('input-2').style.color = 'red';
        error = true;
      } else {
        document.getElementById('input-2').style.color = '';
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

      if (this.form.expiredAt == '') {
        document.getElementById('input-7').style.borderColor = 'red';
        error = true;
      } else {
        document.getElementById('input-7').style.borderColor = '';
      }

      if (error) {
        return false;
      }
      return true;

    },
    create() {
      if (this.validate()) {
        const listing = {
          name: this.form.name,
          // always to 2dp
          price: (Math.round(this.form.price * 100) / 100).toFixed(2),
          quantity: this.form.quantity,
          unit: this.form.unit,
          description: this.form.description,
          expiredAt: new Date(this.form.expiredAt),
          category: this.form.category,
          createdAt: new Date(),
          status: 'Available',
          interests: [],
          bookmarks: [],
          sellerId: store.getters.getProfileState.id,
        };
        createListing(listing);
        alert('Listing created');
        location.reload();
      } else {
        alert('Something went wrong, please check the inputs and try again');
      }
    },
  },
};
</script>

<style scoped>
.headerFont {
  font-size: 25px;
}

.product-photo {
  max-width: 400px;
  max-height: 400px;
}

input[type="file"] {
  display: none;
}


</style>
