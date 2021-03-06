import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

//components
import App from './App.vue';
import InvoiceList from './components/InvoiceList';
import Invoice from './components/Invoice';
import InvoiceItem from './components/InvoiceItem';

Vue.component('invoice-list', InvoiceList);
Vue.component('invoice-item', InvoiceItem);
Vue.component('invoice', Invoice);

const routes = [
  {path: '/', component: InvoiceList},
  {path: '/invoice', component: Invoice, name: 'createInvoice'},
  {path: '/invoice/:id', component: Invoice, name: 'editInvoice'}
  ];
const router = new VueRouter({
  routes,
  mode: 'history'
});
new Vue({
  router
}).$mount('#app');
