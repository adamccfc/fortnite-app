<template>
  <main id="app">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-8 col-sm-12">

          <form class="mb-4" method="get" @submit.prevent="getStats">
            <div v-for="(player, index) in players" :key="player.username">
              <div class="form-group row">
                <label class="col-sm-4 col-form-label" :for="'player' + index">Player {{ index + 1 }}</label>
                <div class="col-sm-8">
                  <input class="form-control ml-md" :id="'player' + index" type="text" v-model="player.username" placeholder="e.g. Ninja" value="player1">
                </div>
              </div>
              <fieldset class="form-group">
                <div class="row">
                  <legend class="col-form-label col-sm-4 pt-0">Platform</legend>
                  <div class="col-sm-8">
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" :id="index + 'PC'" value="pc" v-model="player.platform">
                      <label class="form-check-label" :for="index + 'PC'">PC</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" :id="index + 'PS4'" value="psn" v-model="player.platform" checked="checked">
                      <label class="form-check-label" :for="index + 'PS4'">PS4</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" :id="index + 'Xbox'" value="xbl" v-model="player.platform" checked="checked">
                      <label class="form-check-label" :for="index + 'Xbox'">Xbox</label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
            <div v-if="players[0].username && players[1].username">
              <button type="submit" class="btn btn-primary btn-sm">Compare players</button>
            </div>
            <div v-if="addPlayers">
              <button @click="addPlayer" type="button" class="btn btn-success btn-sm">Add player</button>
            </div>
            <div v-if="removePlayers">
              <button @click="removePlayers" type="button" class="btn btn-danger btn-sm">Remove player</button>
            </div>
          </form>

          <transition name="fade">
            <div class="alert alert-info" role="alert" v-if="loading">
              Loading.....
            </div>
          </transition>

          <div v-if="lifeTimeChart">
            <transition name="fade">
              <canvas id="lifetime-chart"></canvas>
            </transition>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Axios from "axios";
import Chart from 'chart.js';

export default {
  name: "app",
  data() {
    return {
      loading: false,
      addPlayers: true,
      removePlayers: false,
      players: [
        {
          username: "AdamCCFC",
          platform: "psn",
          stats: {}
        },
        {
          username: "Oding_.69",
          platform: "psn",
          stats: {}
        }
      ],
      lifeTimeChart: {},
    };
  },
  methods: {
    getStats() {
      this.loading = true;

      const headers = {
        headers: {
          "TRN-Api-Key": "dfae8ecd-11fc-4691-a8ed-bef6ad8c4364"
        }
      };

      Axios.all([
        Axios.get(`https://cors-anywhere.herokuapp.com/https://api.fortnitetracker.com/v1/profile/${this.players[0].platform}/${this.players[0].username}`, headers),
        Axios.get(`https://cors-anywhere.herokuapp.com/https://api.fortnitetracker.com/v1/profile/${this.players[1].platform}/${this.players[1].username}`, headers)
      ])
      .then(Axios.spread((player1, player2) => {
        this.loading = false;
        this.players[0].stats = player1.data;
        this.players[1].stats = player2.data;
        this.lifeTimeChart = {
          type: 'horizontalBar',
          data: {
            labels: ['Matches Played', 'Wins', 'Win %', 'Kills', 'K/D'],
            datasets: [
              {
                label: player1.data.epicUserHandle,
                data: [
                  player1.data.lifeTimeStats[7].value,
                  player1.data.lifeTimeStats[8].value,
                  parseInt(player1.data.lifeTimeStats[9].value.replace('%', ''), 10),
                  player1.data.lifeTimeStats[10].value,
                  parseInt(player1.data.lifeTimeStats[11].value, 10),
                ],
                backgroundColor: [
                  'rgba(255,0,0,0.3)', // Red
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)'
                ],
                borderColor: [
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                  'rgba(255,0,0,0.3)',
                ],
                borderWidth: 3
              },
              {
                label: player2.data.epicUserHandle,
                data: [
                  player2.data.lifeTimeStats[7].value,
                  player2.data.lifeTimeStats[8].value,
                  parseInt(player2.data.lifeTimeStats[9].value.replace('%', ''), 10),
                  player2.data.lifeTimeStats[10].value,
                  parseInt(player2.data.lifeTimeStats[11].value, 10),
                ],
                backgroundColor: [
                  'rgba(0,0,255,0.3)', // Blue
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)'
                ],
                borderColor: [
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                  'rgba(0,0,255,0.3)',
                ],
                borderWidth: 3
              },
            ]
          },
          options: {
            responsive: true,
            lineTension: 1,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  padding: 25,
                }
              }]
            },
            title: {
              display: true,
              text: 'Lifetime Stats'
            }
          }
        }


        this.createChart('lifetime-chart', this.lifeTimeChart);

      }),
        error => {
          this.error = true;
          this.loading = false;
          return error;
        }
      );
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    addPlayer() {
      this.players.push({
        username: "",
        platform: "pc",
        stats: {}
      });
    },
  },
};
</script>

<style>
#app {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
