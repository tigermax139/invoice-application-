<template>
  <div class="container-fluid">
    <div class="row align-items-center justify-content-between">
      <h2 class="h2">List of invoices</h2>
      <router-link v-bind:to="{name: 'createInvoice'}" class="btn-success rounded p-2 top">
        New invoice
      </router-link>
    </div>
    <hr>
    <div class="uk-background-muted" v-if="invoices.length === 0">
      <h4 class="uk-h4 uk-text-center"> No invoices Yet...</h4>
    </div>
    <table v-else class="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th class="uk-width-2-5 uk-text-bold">#</th>
          <th class="uk-text-bold">Total</th>
          <th class="uk-text-bold">Created Date</th>
          <th class="uk-text-bold">Last Update</th>
        </tr>
      </thead>
      <tbody v-html="renderList">
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
       return this.invoices.reduce( (acc, elem) =>
          acc.has(elem.customer_id)
          ? acc.set(elem.customer_id, [...acc.get(elem.customer_id), elem])
          : acc.set(elem.customer_id, [elem])
       , new Map);
      },
      renderList: function () {
        // raw js render because vue.js cycle not correct work with Map
        let html = '';
        for( const item of this.invoicesSortable){
          html = html + `
          <tr>
          <td colspan="4" class="uk-text-bold uk-table-middle">
              <svg style="width: 15px; height: 15px">
                <use xlink:href="#remove"></use>
              </svg>
              ${this.getCustomerName(item[0])}
          </td>
        </tr>`;
          for( const elem of item[1]){
            html = html + `
            <tr>
              <td>
                <router-link :to="{name: 'editInvoice', params: {id: ${elem.id}}"> Invoice #${elem.id} </router-link>
              </td>
              <td> ${elem.total} </td>
              <td> ${ this.getDate(elem.createdAt)}</td>
              <td> ${ this.getDate(elem.updatedAt)}</td>
            </tr>
            `;
          }
        }
        return html;
      }
    },
    methods: {
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
</style>

