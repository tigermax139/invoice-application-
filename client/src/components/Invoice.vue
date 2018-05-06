<template>
  <div>
    <h2>Invoice {{ +$route.params.id ? ('#' + $route.params.id) : 'create'}}</h2>
    <hr>
    <div class="mb-3">
      <label for="customer">
        Customer:
      </label>
      <select class="form-control" name="customer" id="customer"
              v-model="selectedCustomer"
              v-on:change="customerHandler"
              ref="customerSelector">
        <option disabled value="">Check customer</option>
        <option v-for="item in customers" v-bind:value="{id: item.id, name: item.name}"> {{item.name}}</option>
      </select>
    </div>
    <table class="table table-striped table-bordered" v-if="invoiceCreate">
      <thead class="table-active">
        <tr>
          <th colspan="2">
            <select class="form-control" name="product" id="product"
                    v-model="selectedProducts">
              <option disabled value="">Check product</option>
              <option v-for="item in productsFiltered"
                      v-bind:value="{id: item.id, name: item.name, price: item.price}">{{item.name}}</option>
            </select>
          </th>
          <th>
            <button class="btn btn-light border-dark btn-block"
                    v-on:click="addItem"
                    v-if="Object.keys(selectedProducts).length !== 0">
              <span class="d-flex flex-row align-items-center justify-content-center">
                <svg class="mr-1">
                  <use xlink:href="#add"></use>
                </svg>
                Add product
              </span>
            </button>
            <button class="btn btn-light border-dark btn-block"
                    v-else disabled>
              Add product
            </button>
          </th>
        </tr>
      </thead>
      <tbody v-if="invoiceItems.length === 0">
      <tr>
        <td colspan="3">
          No items yet...
        </td>
      </tr>
      </tbody>
      <tbody v-else >
      <tr>
        <!--for striped temp-->
      </tr>
          <invoice-item v-for="item in invoiceItems"
                        v-bind:item="item"
                        v-bind:invoice_id="invoice.id"
                        v-on:deletedItem="deleteItemHandler"
                        v-on:changedQuantity="changeQuantityHandler">
          </invoice-item>
      </tbody>
      <tr>
        <td colspan="2">
          <p class="font-weight-bold text-right"> Discount: </p>
        </td>
        <td>
          <div class="input-group ">
            <input type="number" min="0" step="1" class="form-control" id="discount"
                   v-model.number="discount">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1">%</span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <p class="font-weight-bold text-right">
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
          .then( res => res.status === 201 ? res.json() : null )
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
              body: JSON.stringify({
                customer_id: this.selectedCustomer.id,
                discount: 0,
                total: 0
              })
            })
            .then( res => res.json())
            .then( json => {
              this.invoice = Object.assign({},json);
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
        .catch( err => console.log(err));
      fetch(`${config.apiURL}/api/products`, {method: 'get'})
        .then( res => res.status === 200 ? res.json() : null)
        .then( json => this.products = json)
        .catch( err => console.log(err));
    },
    mounted: function () {
      // for editInvoice page
      if( +this.$route.params.id){
        const id = Number(this.$route.params.id);
        fetch(`${config.apiURL}/api/invoices/${id}`, {method: 'get'})
          .then( res => res.status === 200 ? res.json() : null)
          .then( json => {
            if( json !== null){
              this.invoice = json;
              this.invoiceCreate = true;
              this.discount = json.discount;
              // ref + selectedIndex is not reactive. Don't work
              for(const customer of this.customers){
                if( customer.id === this.invoice.customer_id){
                  this.selectedCustomer = {
                    id: customer.id,
                    name: customer.name
                  };
                  break;
                }
              }
            }else {
              this.$router.push({name: 'createInvoice'});
            }
          })
          .catch( err => console.log(err));
        fetch(`${config.apiURL}/api/invoices/${id}/items`, {method: 'get'})
          .then( res => res.status === 200 ? res.json() : null)
          .then( json => {
            for( const item of json) {
              let newItem  = {
                id: item.id,
                name: '',
                quantity: item.quantity,
                price: 0,
                total: 0
              };
              for(const product of this.products){
                if(product.id === item.product_id) {
                  newItem.name = product.name;
                  newItem.price = product.price;
                  newItem.total = Number((product.price * item.quantity).toFixed(2));
                  break;
                }
              }
              this.invoiceItems.push(newItem);
            }
          })
          .catch( err => console.log(err));
      }
    }
  }
</script>

<style scoped>
  svg {
    width: 15px;
    height: 15px;
  }

</style>
