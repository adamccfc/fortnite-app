<template>
  <main id="app">

    <transition name="fade">
      <div class="loader" v-if="loading">
        <div class="container h-100">
          <div class="row h-100 justify-content-center align-items-center">
            <bounce-loader :loading="loading" :color="color"></bounce-loader>
            <!-- <p>Loading...</p> -->
          </div>
        </div>
      </div>
    </transition>

    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-10 col-sm-12">

          <div class="card mt-5">
            <div class="card-header">
              <strong>Fortnite Player Comparison</strong>
            </div>
            <div class="card-body">
              <form method="get" @submit.prevent="getStats">
                <div v-for="(player, index) in players" :key="index">
                  <div class="form-group row">
                    <label class="col-sm-4 col-form-label" :for="'player' + index">Player {{ index + 1 }}</label>
                    <div class="col-sm-8">
                      <input :class="{ 'is-invalid' : player.error }" class="form-control ml-md" :id="'player' + index" :name="'player' + index" type="text" placeholder="e.g. Ninja" v-model="player.username">
                      <div v-if="player.error" class="invalid-feedback">
                        This username does not exist for this platform.
                      </div>
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
                <!-- Form Buttons -->
                <button type="submit" class="btn btn-primary btn-sm mr-2" :disabled="comparePlayers == 0">Compare</button>
                <button @click="addPlayer" type="button" class="btn btn-success btn-sm mr-2" :disabled="players.length > 3"><icon icon="plus" /></button>
                <button @click="removePlayer" type="button" class="btn btn-danger btn-sm" :disabled="players.length < 3"><icon icon="minus" /></button>
              </form>
            </div>
          </div>

          <transition name="fade">
            <div class="alert alert-info mt-4" role="alert" v-if="loading">
              Loading.....
            </div>
          </transition>

          <transition name="fade">
            <div class="alert alert-danger mt-4" role="alert" v-if="error">
              An error has occurred.
            </div>
          </transition>

          <div v-if="lifeTimeChart" class="mt-4">
            <transition name="fade">
              <canvas id="lifetime-chart"></canvas>
            </transition>
          </div>

          <!-- <b-card no-body>
            <b-tabs pills fill card>
              <b-tab title="Single" active>
                Tab Contents 1
              </b-tab>
              <b-tab title="Duos">
                Tab Contents 2
              </b-tab>
              <b-tab title="Squads">
                Tab Contents 2
              </b-tab>
            </b-tabs>
          </b-card> -->

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
        color: '#ffffff',
        loading: false,
        error: false,
        players: [
          {
            username: "AdamCCFC",
            platform: "psn",
            stats: {},
            error: false,
          },
          {
            username: "Oding_.69",
            platform: "psn",
            stats: {},
            error: false,
          }
        ],
        lifeTimeChart: {
          type: "",
          data: {
            labels: [],
            datasets: [],
          },
          options: {},
        },
      };
    },
    computed: {
      comparePlayers() {
        for (let player of this.players) {
          if (player.username === "" || player.username === null) {
            return false;
          }
        }
        return true;
      }
    },
    methods: {
      getStats() {
        this.loading = true;
        this.error = false;

        const headers = {
          headers: {
            "TRN-Api-Key": "dfae8ecd-11fc-4691-a8ed-bef6ad8c4364"
          }
        };

        Axios.all(this.players.map(player => Axios.get(`https://cors-anywhere.herokuapp.com/https://api.fortnitetracker.com/v1/profile/${player.platform}/${player.username}`, headers)))
        .then(
          (results) => {
            this.loading = false;

            for (let [index, result] of results.entries()) {
              if (result.data.error) {
                this.error = true;
                this.players[index].error = true;
              }
            }

            // Check to see if any of the requests fail
            if (this.error === false) {
              // Start formatting the lifetime stats chart
              this.lifeTimeChart.type = 'horizontalBar';
              this.lifeTimeChart.data.labels = ['Matches Played'];

              // Map the data from the api request
              this.lifeTimeChart.data.datasets = results.map(result => {
                let dataObj = {
                  label: result.data.epicUserHandle,
                  data: [
                    result.data.lifeTimeStats[7].value,
                    // result.data.lifeTimeStats[8].value,
                    // parseInt(result.data.lifeTimeStats[9].value.replace('%', ''), 10),
                    // result.data.lifeTimeStats[10].value,
                    // parseInt(result.data.lifeTimeStats[11].value, 10),
                  ],
                  borderWidth: 3
                };
                return dataObj;
              });

              // Set the chart options
              this.lifeTimeChart.options = {
                responsive: true,
                lineTension: 1,
                scales: {
                  xAxes: [{
                    gridLines: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      display: false
                    }
                  }],
                  yAxes: [{
                    gridLines: {
                      display: false,
                      drawBorder: false
                    }
                  }]
                },
              };

              // Create the chart
              this.createChart('lifetime-chart', this.lifeTimeChart);
            }
          },
          (error) => {
            this.error = true;
            this.loading = false;
            return error;
          },
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
      removePlayer() {
        this.players.splice(-1, 1);
      }
    },
  };
</script>

<style>
  body {
    background-color: #fbfbfb !important;
  }

  #app {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .loader {
    position: fixed;
    height: 100%;
    width: 100%;
    background: linear-gradient(to bottom right, #339BDC, #7ADDF8);
    z-index: 2;
  }
</style>
