import Vue from 'vue'
import App from './App.vue'
import RecentMatches from './components/RecentMatches.vue'
import 'bootstrap/dist/css/bootstrap.css'

// Allows moment js to be used
Vue.use(require('vue-moment'));

// Components
Vue.component('recent-matches', RecentMatches);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
