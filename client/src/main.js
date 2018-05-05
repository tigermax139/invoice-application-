import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//components
import App from './App.vue';
import InvoiceList from './components/InvoiceList';
import Invoice from './components/Invoice';
import InvoiceItem from './components/InvoiceItem';
import InvoiceEdit from './components/InvoiceEdit';

Vue.component('invoice-list', InvoiceList);
Vue.component('invoice-item', InvoiceItem);
Vue.component('invoice', Invoice);
Vue.component('invoice-edit', InvoiceEdit);

const routes = [
  {path: '/', component: InvoiceList},
  {path: '/invoice', component: Invoice},
  {path: '/invoice/:id', component: InvoiceEdit, name:'invoice'}
  ];
const router = new VueRouter({
  routes,
  mode: 'history'
});
new Vue({
  router
}).$mount('#app');
