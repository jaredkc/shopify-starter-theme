/**
 * Scripts and styles used globally
 */
import '../scss/theme.scss';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes';
import Vue from 'vue';
import App from './App.vue';

console.log('Hello from theme.js');

Vue.config.productionTip = true;

new Vue({
  render: h => h(App),
}).$mount('#vue-app-example');
