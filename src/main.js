import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from "bootstrap-vue";
import RecentMatches from './components/RecentMatches.vue';
import BounceLoader from "vue-spinner/src/BounceLoader.vue";

// Use dependencies
Vue.use(BootstrapVue);
Vue.use(require('vue-moment'));

// Import bootstrap css
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Import font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlus);
library.add(faMinus);

// Components
Vue.component('recent-matches', RecentMatches);
Vue.component("icon", FontAwesomeIcon);
Vue.component("bounce-loader", BounceLoader);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
