<template>
  <div class="product-card" @click.prevent="onClick($event)">
    <div class="sale" v-if="product?.discount">Sale {{ product?.discount }}%</div>
    <img :src="product?.picture" :alt="product?.name || ''" class="product-image" />
    
    <p class="product-price">{{ formatCurrency(product.price) }} VND</p>
    <p class="product-description">{{ product?.name }}</p>
    <button @click.prevent="onAddCart($event, product)">Thêm vào giỏ hàng</button>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useCart } from "@/stores/cart";

const router = useRouter();
const cartStore = useCart();

const props = defineProps(["product", "route"]);

function onClick() {
  router.push({
    name: "product-detail",
    params: { id: props?.product?.id },
    meta: { pet: props.product },
  });
}

function onAddCart(e, item) {
  if (e)
    e.stopPropagation()
  cartStore.addCart(item)
  notify({ title: "Thêm sản phẩm", text: "Thêm sản phẩm vào giỏ hàng thành công!" });
}

</script>

<style lang="scss" scoped>
.product-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 200px;
  // height: 300px;
  margin: 10px;
  padding: 9px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  &:hover {
    transform: scale(1.008);
    cursor: pointer;
  }
  .product-image {
    width: 100%;
    height: 50%;
    min-height: 150px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    border-radius: 10px;
  }

  .product-price {
    color: #e74c3c;
    font-weight: bold;
    margin: 10px 0;
  }

  .product-description {
    margin-top: auto;
    color: #000000;
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .sale {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: red;
    padding: 0.25rem 1rem;
    font-weight: bold;
    color: #fff;
    border-radius: 0.75rem;
    border: 1px solid #fff;
    box-shadow: -4px 4px 2px 0px rgba(242,227,227,0.8);
  }
  button {
    height: 40px;
    border-radius: 40px;
    background-color: rgb(243, 5, 96);
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.4s ease;
    width: 100%;
    color: #fff;
  }
}
</style>