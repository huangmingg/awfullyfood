
import { Doughnut } from 'vue-chartjs'
import database from '../../../firebase.js'
import { getUserProfile } from "@/services/user.service";
import { authService } from "@/firebase";
import { store } from "@/stores";

export default {
  extends: Doughnut,
  data: function () {
    return {
      datacollection: {
        labels: ["Ugly", "Expiring"],
        datasets: [{
          label: "Number of Orders by Category",
          backgroundColor: ["", ""],
          data: [0, 0]
        }]
      },
      options: {
        legend: { display: true },
        title: {
          display: true,
          text: 'Number of Completed Orders by Category'
        },
        responsive: true,
        maintainAspectRatio: false,

      }
    }
  },
  watch: {
    datacollection: function() {
      this.renderChart(this.datacollection, this.options);
    }
  },
  methods: {
    fetchItems: function () {

      database.collection('transactions').get().then(querySnapShot => {
        querySnapShot.forEach(doc => {
          //console.log(doc.data())
          if (doc.data()["isApproved"] &&
            doc.data()["buyerId"] == store.getters.getProfileState?.id) {
            //console.log("hi")
            var listingId = doc.data()["listingId"];
            database
              .collection("listings")
              .doc(listingId)
              .get()
              .then((querySnapShot2) => {
                //console.log(querySnapShot2)
                var key = querySnapShot2.data()['category']
                if (key == "Ugly") {
                  //console.log(key)
                  this.datacollection.datasets[0].data[0] += 1
                  this.datacollection.datasets[0].backgroundColor[0] = this.getRandomColour()
                  //console.log(this.datacollection.datasets[0].data[0])
                } else if (key == "Expired") {
                  this.datacollection.datasets[0].data[1] += 1
                  this.datacollection.datasets[0].backgroundColor[1] = this.getRandomColour()
                  //console.log(this.datacollection.datasets[0].data[1])
                }
                this.renderChart(this.datacollection, this.options)
              });
          }
        })
      })
    },

    getRandomColour: function () {
      var letters = '0123456789ABCDEF'.split('')
      var colour = '#'
      for (var i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)]
      }
      return colour
    },

  },
  async created() {
    if (!store.getters.getProfileState) {
      await getUserProfile(authService.currentUser.uid);
    }
    await this.fetchItems()
  },

}
