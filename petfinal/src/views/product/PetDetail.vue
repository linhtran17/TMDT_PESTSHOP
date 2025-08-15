<template>
  <main class="container">
    <div class="detail">
      <div class="sanpham">
        <img :src="product?.picture" :alt="product?.catPro?.name || ''" class="avatar" />

      </div>
      
      <div class="container">
        <h2>
          {{ product?.name }}
        </h2>

        <div class="infor">
          <h4>
            Giá bán : <span class="price"> {{ formatCurrency(calDiscount(product?.price, product?.discount)) }}
              VND</span>
            <span class="price-ord"> {{ formatCurrency(product?.price) }} VND</span>
          </h4>
          <h4>
            Thương hiệu : <span> {{ product?.catPro?.name }} </span> | Tình trạng : Còn
            hàng
          </h4>
          <h5>Mô tả:<span> {{ product?.description }} </span></h5> 
          <pre></pre>
        </div>
        <button class="pet-btn-primary " @click="onAddCart(product)">Thêm vào giỏ hàng</button>
      
      </div>
    </div>
  </main>
</template>
<style scoped>
.detail {
  font-family: Arial, sans-serif;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  position: relative;
  display: flex;
}

.sanpham {
  flex: 0 0 40%;
}

.sanpham img.avatar {
  width: 500px;
  height: 500px;
  margin: 3px;
}

.avatar-small {
  width: 150px;
  height: 150px;
  margin: 5px;
  border-radius: 4px;
}

.container {
  flex: 0 0 60%;
  right: 10%;
  top: auto;
  border: 10px red;
}

.container h3 {
  font-size: 24px;
  color: #333;
}

.infor h5 {
  font-size: 18px;
  color: #666;
}

.infor .price {
  color: #e60000;
  font-weight: bold;
}

.infor .price-ord {
  text-decoration: line-through;
  color: #999;
  margin-left: 10px;
}

button {
  background-color: #e60000;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 20px;
  width: 400px;
}

button:hover {
  background-color: #cc0000;
}



.price-ord {
  font-size: small;
}

.nav {
  font-size: 24px;
  color: #e60000;
}

.feedback {
  margin-top: 20px;
}

.feedback h3 {
  font-size: 22px;
  color: #333;
}



.star {
  width: 130px;
  height: 130px;
}

.cmt {
  width: 100%;
  height: 400px;
}

.feedback nav button {
  background-color: #f1e7ee;
  color: #333;
  border: 1px solid #e20101;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.feedback nav button:hover {
  background-color: #f86009;
}

.hihi {
  width: 30%;
  height: 40px;
  border-radius: 40px;
  background-color: rgb(202, 69, 69);
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-top: auto;
  /* Đẩy nút xuống dưới cùng */
  transition: all 0.4s ease;
}

pre {
  font-family: Arial, Helvetica, sans-serif;
}
</style>

<script setup>
import { useRoute } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import publicApi from "../../api/public.api";
import { onMounted, ref } from "vue";
import { useCart } from "@/stores/cart";

const product = ref({});

const route = useRoute();

const cartStore = useCart();

onMounted(async () => {
  publicApi
    .productById(route.params.id)
    .then((data) => {
      product.value = data;
    })
    .catch((err) => console.log(err));
});

function onAddCart(item) {
  if (item) {
    cartStore.addCart(item);
    notify({ title: "Information", text: "Add Cart Sussessfully!" });
  }
}

function calDiscount(price, discount) {
  if (discount) return price - Number((price / 100) * discount);
  return price;
}
</script>
