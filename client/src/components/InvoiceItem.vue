<template>
  <tr>
    <td class="w-50">
      <div class="d-flex align-items-center">
        {{item.name}}
        <button class="btn btn-link red-icon ml-1" v-on:click="deleteItem">
          <svg class="uk-icon">
            <use xlink:href="#garbage"></use>
          </svg>
        </button>
      </div>
    </td>
    <td class="w-10">
      <input type="number" class="form-control"
             v-bind:value="item.quantity"
             v-on:change="quantityHandler">
    </td>
    <td class="w-10 text-right">
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
    width: 18px;
    height: 18px;
  }
  .w-10 {
    width: 10%;
    min-width: 80px;
  }
</style>
