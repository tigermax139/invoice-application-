<template>
  <div class="uk-container uk-container-expand">
    <h2>Invoice {{'#' + $route.params.id || 'create'}}</h2>
    <hr>
    <label for="customer">
      Customer:
    </label>
    <select class="uk-select uk-width-1-1" name="customer" id="customer"
            v-for="item in customers"
            v-model="selectedCustomer">
      <option> {{item.name}}</option>
    </select>
    <table class="uk-table uk-table-striped uk-table-divider">
      <tr>
        <td>
          <select class="uk-select uk-width-1-1" name="product" id="product"
                  v-for="item in products"
                  v-model="selectedProducts">
            <option> {{item.name}} / {{item.price}}</option>
          </select>
        </td>
        <td>
          <button class="uk-button uk-button-default" v-on:click="addItem">
            <span class="uk-icon" uk-icon="icon:plus"></span>
            Add product
          </button>
        </td>
      </tr>
      <tbody v-for="item in invoiceItems">
      <tr>
        <td>{{item.name}} <a href="#" class="uk-icon-link red-icon" uk-icon="trash"
                             v-on:click.prevent="deteleItem(item.id)"></a>
        </td>
        <td>
          <input type="number" class="uk-input"
                 v-bind:value="item.quantity"
                 v-on:change="quantityHandler(item.id)">
        </td>
        <td>
          {{ getPrice(item.id)}}
        </td>
      </tr>
      </tbody>
      <tr>
        <td>
          <p class="uk-text-right">
            Discount
          </p>
        </td>
        <td>
          <input type="number" class="uk-input" v-model="discount">
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  export default {
    name: "invoice-edit",
    data() {
      return {
        invoice: {},
        customers: [],
        products: [],
        invoiceItems: [],
        discount: 0,
        total: 0,
        selectedCustomer: '',
        selectedProducts: '',
      }
    },
    // @todo get discount
    methods: {
      addItem: function () {
        // @todo add new item
      },
      quantityHandler: function () {
        // @todo quantity handler
      },
      getPrice: function () {
        // @todo get price from product
      }
    }
  }
</script>

<style scoped>
  .red-icon {
    fill: red;
    stroke: red;
  }
</style>
