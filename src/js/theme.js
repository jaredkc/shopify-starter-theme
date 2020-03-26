/**
 * Scripts and styles used globally
 */
import '../css/theme.css';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';
import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = true;

new Vue({
  render: (h) => h(App),
}).$mount('#vue-app');
