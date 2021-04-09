
import { Doughnut } from 'vue-chartjs';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { store } from '@/stores';
import database from '../../../firebase.js';

export default {
  extends: Doughnut,
  data() {
    return {
      datacollection: {
        labels: ['Ugly', 'Expiring'],
        datasets: [{
          label: 'Number of Orders by Category',
          backgroundColor: ['#0074d9', '#c49f21'],
          data: [0, 0],
        }],
      },
      options: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Number of Completed Orders by Category',
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  watch: {
    datacollection() {
      this.renderChart(this.datacollection, this.options);
    },
  },
  methods: {
    fetchItems() {

      database.collection('transactions').get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          if (doc.data().isApproved &&
            doc.data().buyerId == store.getters.getProfileState?.id) {
            const listingId = doc.data().listingId;
            database
              .collection('listings')
              .doc(listingId)
              .get()
              .then((querySnapShot2) => {
                const key = querySnapShot2.data().category;
                if (key == 'Ugly') {
                  this.datacollection.datasets[0].data[0] += 1;
                } else if (key == 'Expired') {
                  this.datacollection.datasets[0].data[1] += 1;
                }
                this.renderChart(this.datacollection, this.options);
              });
          }
        });
      });
    },
  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    await this.fetchItems();
  },

};
