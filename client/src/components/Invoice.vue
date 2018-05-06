<template>
  <div class="uk-container uk-container-expand">
    <h2>Invoice create</h2>
    <hr>
    <label for="customer">
      Customer:
    </label>
    <select class="uk-select uk-width-1-1" name="customer" id="customer"
            v-model="selectedCustomer"
            v-on:change="customerHandler">
      <option disabled value="">Check customer</option>
      <option v-for="item in customers" v-bind:value="{id: item.id}"> {{item.name}}</option>
    </select>
    <table class="uk-table uk-table-striped uk-table-divider" v-if="invoiceCreate">
      <tr>
        <td colspan="2">
          <select class="uk-select uk-width-1-1" name="product" id="product"
                  v-model="selectedProducts">
            <option disabled value="">Check product</option>
            <option v-for="item in productsFiltered"
                    v-bind:value="{id: item.id, name: item.name, price: item.price}">{{item.name}}</option>
          </select>
        </td>
        <td>
          <button class="uk-button uk-button-default uk-width-1-1"
                  v-on:click="addItem"
                  v-if="Object.keys(selectedProducts).length !== 0">
            <span class="uk-flex uk-flex-middle uk-flex-center">
              <svg class="uk-icon uk-margin-small-right">
                <use xlink:href="#add"></use>
              </svg>
              Add product
            </span>
          </button>
          <button class="uk-button uk-button-default uk-width-1-1"
                  v-else disabled>
            Add product
          </button>
        </td>
      </tr>
      <tbody v-if="invoiceItems.length === 0">
      <tr>
        <td colspan="3">
          No items yet...
        </td>
      </tr>
      </tbody>
      <tbody v-else v-for="item in invoiceItems">
        <invoice-item v-bind:item="item"
                      v-bind:invoice_id="invoice.id"
                      v-on:deletedItem="deleteItemHandler"
                      v-on:changedQuantity="changeQuantityHandler">
        </invoice-item>
      </tbody>
      <tr>
        <td colspan="2">
          <p class="uk-text-right uk-text-bold"> Discount </p>
        </td>
        <td class="uk-width-medium">
          <input type="number" min="0" step="1" class="uk-input"
                 v-model.number="discount">
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <p class="uk-text-right uk-text-bold">
            Total: ${{total}}
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import config from '../../config.js';
  export default {
    name: "invoice",
    data() {
      return {
        invoiceCreate: false,
        invoice: {},
        customers: [],
        products: [],
        invoiceItems: [],
        discount: 0,
        selectedProducts: '',
        selectedCustomer: ''
      }
    },
    computed: {
      productsFiltered: function () {
        return this.invoiceItems.length > 0
          ? this.products.filter( el => !this.arrFilter.includes(el.name))
          : this.products;
      },
      arrFilter: function () {
        // array from invoiceItem names for filter
        if(this.invoiceItems.length > 0) {
          return this.invoiceItems.map( el => el.name);
        }
      },
      total: function () {
        if(this.invoiceItems.length !== 0) {
         const sum =  this.invoiceItems.reduce( (sum, elem) => {
            return sum + ( Number(elem.quantity) * Number(elem.price));
          }, 0);
         return Number((sum - sum * (this.discount/100)).toFixed(2));
        }
        return 0;
      }
    },
    methods: {
      addItem: function () {
        const newItem = {
          invoice_id: this.invoice.id,
          product_id: this.selectedProducts.id,
          quantity: 1
        };
        fetch(`${config.apiURL}/api/invoices/${this.invoice.id}/items`, {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newItem)
        })
          .then( res => res.status === 200 ? res.json() : null )
          .then( json => {
            const newItem = {
              id: json.id,
              name: this.selectedProducts.name,
              quantity: 1,
              price: this.selectedProducts.price,
              total: this.selectedProducts.price
            };
            this.invoiceItems.push(newItem);
            this.selectedProducts = '';
          })
          .catch( err => consple.log(err));
      },
      deleteItemHandler: function (evt) {
        for( const index in this.invoiceItems) {
          if(this.invoiceItems[index].id === evt){
            this.invoiceItems.splice(index, 1);
            break;
          }
        }
      },
      changeQuantityHandler: function (evt) {
        for( const index in this.invoiceItems) {
          if(this.invoiceItems[index].id === evt.id){
            this.invoiceItems[index].quantity = Number(evt.quantity);
            break;
          }
        }
      },
      updateInvoice: function (data) {
        fetch(`${config.apiURL}/api/invoices/${this.invoice.id}`,
          {method: 'put',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(data)
          })
          .then( res => {
            if(res.status === 204){
              console.log('invoice was updated!');
            }else {
              UIkit.notification({
                message: 'server response is not correct, try again later!',
                status: 'danger',
                pos: 'top-right',
                timeout: 4000
              });
            }
          })
          .catch( err => {
            console.log(err);
            UIkit.notification({
              message: 'server-error!',
              status: 'error',
              pos: 'top-right',
              timeout: 4000
            });
          });
      },
      customerHandler: function () {
        if(this.invoiceCreate === false){
          fetch(`${config.apiURL}/api/invoices`,
            {method: 'post',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              mode: 'cors',
              body: JSON.stringify({customer_id: this.selectedCustomer.id})
            })
            .then( res => res.json())
            .then( json => {
              this.invoice = json;
              this.invoiceCreate = true;
            })
            .catch( err => consple.log(err));
        }else {
          this.updateInvoice({customer_id: this.selectedCustomer.id});
        }
      }
    },
    watch: {
      total: function (val) {
        this.updateInvoice({total: val});
      },
      discount: function (val) {
        if(val >= 0) {
          this.updateInvoice({discount: val});
        }
      }
    },
    beforeMount: function () {
      fetch(`${config.apiURL}/api/customers`, {method: 'get'})
        .then( res => res.status === 200 ? res.json() : null)
        .then( json => this.customers = json)
        .catch( err => consple.log(err));
      fetch(`${config.apiURL}/api/products`, {method: 'get'})
        .then( res => res.status === 200 ? res.json() : null)
        .then( json => this.products = json)
        .catch( err => consple.log(err));
    }
    // ,
    // beforeCreate: function () {
    //   fetch(`${config.apiURL}/api/invoices`, {method: 'post'})
    //     .then( res => {
    //         res.json().then( json => { this.invoice = json; });
    //     })
    //     .catch( err => console.log(err));
    // }
  }
</script>

<style scoped>
  svg {
    width: 15px;
    height: 15px;
  }
</style>
