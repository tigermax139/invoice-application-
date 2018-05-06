<template>
  <tr>
    <td class="uk-table-middle">
      {{item.name}}
      <button class="uk-button-default uk-icon-link red-icon" v-on:click="deleteItem">
        <svg class="uk-icon">
          <use xlink:href="#garbage"></use>
        </svg>
      </button>
    </td>
    <td class="uk-width-medium">
      <input type="number" class="uk-input"
             v-bind:value="item.quantity"
             v-on:change="quantityHandler">
    </td>
    <td class="uk-text-right">
      $ {{ item.total }}
    </td>
  </tr>
</template>

<script>
  import config from '../../config.js';
  export default {
    name: "invoice-item",
    data: function () {
      return {
        counter: 0
      }
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      invoice_id: {
        type: Number,
        required: true
      }
    },
    methods: {
      deleteItem: function () {
        fetch(`${config.apiURL}/api/invoices/${this.invoice_id}/items/${this.item.id}`, {method: 'delete'})
          .then( res => {
            if(res.status === 204){
              this.$emit('deletedItem', this.item.id);
            }
          })
          .catch( err => console.log(err));
      },
      quantityHandler: function (evt) {
        fetch(`${config.apiURL}/api/invoices/${this.invoice_id}/items/${this.item.id}`,
          {method: 'put',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({quantity: evt.target.value})
          })
          .then( res => {
            if(res.status === 204){
              this.item.quantity = evt.target.value;
              this.item.total = Number((Number(this.item.price) * Number(this.item.quantity)).toFixed(2));
              this.$emit('changedQuantity', {id: this.item.id, quantity: this.item.quantity});
            }else {
              Uikit.notification({
                message: 'server-error!',
                status: 'danger',
                pos: 'top-right',
                timeout: 4000})
            }
          })
          .catch( err => console.log(err));
      }
    }
  }
</script>

<style scoped>
  .red-icon svg{
    fill: #A74544;
  }
  .red-icon:hover,
  .red-icon:focus {
    fill: red;
  }
  svg {
    width: 15px;
    height: 15px;
  }
</style>
