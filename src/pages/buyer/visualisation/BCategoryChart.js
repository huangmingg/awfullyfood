import { Doughnut } from 'vue-chartjs';
import { getUserProfile } from '@/services/user.service';
import { authService } from '@/firebase';
import { store } from '@/stores';
import { getTransactionsByBuyer } from '@/services/transaction.service';
import { getListings } from '@/services/list.service';

export default {
  extends: Doughnut,
  data() {
    return {
      dataCollection: {
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

  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    const loader = this.$loading.show({ color: 'teal' });
    await getListings();
    await store.dispatch('resetFilter');
    await store.dispatch('filterList');
    await getTransactionsByBuyer(store.getters.getProfileId);
    loader.hide();
    await this.initChart();
  },

  methods: {
    async initChart() {
      const transactions = store.getters.getApprovedTransaction;
      const listings = store.getters.getList;
      transactions.forEach((t) => {
        const list = listings.find(element => element.id === t.listingId);
        switch (list?.category) {
        case 'Ugly':
          this.dataCollection.datasets[0].data[0] += 1;
          break;
        case 'Expiring':
          this.dataCollection.datasets[0].data[1] += 1;
          break;
        default:
          break;
        }
      }
      );
      this.renderChart(this.dataCollection, this.options);
    },
  },

};
