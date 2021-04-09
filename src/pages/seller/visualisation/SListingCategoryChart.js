import { Doughnut } from 'vue-chartjs';
import { store } from '@/stores';
import { getListingBySeller } from '@/services/list.service';

export default {
  extends: Doughnut,
  data() {
    return {
      dataCollection: {
        labels: ['Ugly', 'Expiring'],
        datasets: [{
          label: 'Number of Listings per Category',
          backgroundColor: ['#0074d9', '#c49f21'],
          data: [0, 0],
        }],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Number of Listings per Category',
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
  async created() {
    await this.initChart();
  },
  methods: {
    async initChart() {
      await getListingBySeller(store.getters.getProfileId);
      await store.dispatch('setFilter', { itemCategory: ['Ugly'] });
      await store.dispatch('filterList');
      const ugly = await store.getters.getFilteredList;
      await store.dispatch('setFilter', { itemCategory: ['Expiring'] });
      await store.dispatch('filterList');
      const expiring = await store.getters.getFilteredList;
      this.dataCollection.datasets[0].data[0] = ugly.length ? ugly.length : 0;
      this.dataCollection.datasets[0].data[1] = expiring.length ? expiring.length : 0;
      this.renderChart(this.dataCollection, this.options);
    },
  },
};

