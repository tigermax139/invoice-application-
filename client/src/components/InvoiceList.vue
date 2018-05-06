<template>
  <div class="uk-container uk-container-expand uk-margin-medium-top">
    <div class="uk-flex uk-flex-between flex-start">
      <h2 class="uk-h2">List of invoices</h2>
      <router-link to="/invoice" class="uk-button uk-button-primary">
        New invoice
      </router-link>
    </div>
    <hr>
    <div class="uk-background-muted" v-if="invoices.length === 0">
      <h4 class="uk-h4 uk-text-center"> No invoices Yet...</h4>
    </div>
    <table v-else class="uk-table uk-table-striped uk-table-divider">
      <thead>
        <tr>
          <th class="uk-width-2-5 uk-text-bold">#</th>
          <th class="uk-text-bold">Total</th>
          <th class="uk-text-bold">Created Date</th>
          <th class="uk-text-bold">Last Update</th>
        </tr>
      </thead>
      <tbody v-for="item in invoicesSortable">
        <tr v-on:click="accordionHandler">
          <td colspan="4" class="uk-text-bold">
            <div class="uk-flex uk-flex-middle">
              <svg class="uk-icon uk-margin-small-right">
                <use xlink:href="#remove"></use>
              </svg>
              {{ getCustomerName(item.customer_id)}}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <router-link :to="{name: 'invoice', params: {id: item.id}}"> Invoice #{{item.id}} </router-link>
          </td>
          <td> {{item.total}} </td>
          <td> {{ getDate(item.createdAt)}}</td>
          <td> {{ getDate(item.updatedAt)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import config from '../../config.js';
  import moment from 'moment';
  export default {
    name: "invoice-list",
    data() {
      return {
        invoices: [],
        customers: []
      }
    },
    computed: {
      invoicesSortable: function () {
       return this.invoices.sort( (a, b) => a.customer_id - b.customer_id);
      }
    },
    methods: {
      accordionHandler: function (evt) {
        if (!evt.currentTarget.nextElementSibling.classList.contains('uk-hidden')) {
          evt.currentTarget.nextElementSibling.classList.add('uk-hidden');
        } else {
          evt.currentTarget.nextElementSibling.classList.remove('uk-hidden');
        }
      },
      getCustomerName: function (customer_id) {
        let customerName = 'Name is not defined';
        for(const customer of this.customers) {
          if (customer.id === customer_id) {
            customerName = customer.name;
          }
        }
        return customerName;
      },
      getDate: function (dateISO) {
        return moment(dateISO).format('MMMM D, YYYY h:mm:ss A');
      }
    },
    beforeMount: function () {
      fetch(`${config.apiURL}/api/invoices`, {method: 'get'})
        .then( res => res.status === 200 ? res.json() : null)
        .then( json => this.invoices = json)
        .catch( err => console.log(err));
      fetch(`${config.apiURL}/api/customers`, {method: 'get'})
        .then(res => res.status === 200 ? res.json() : null)
        .then(json => this.customers = json)
        .catch( err => console.log(err));
    }
  }
</script>

<style scoped>
  .flex-start {
    align-items: start;
  }
  svg {
    width: 15px;
    height: 15px;
  }
</style>

