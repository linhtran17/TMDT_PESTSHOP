<template>
  <div class="product-card" @click="onClick">
    <div class="sale" v-if="product?.discount">Sale {{ product?.discount }}%</div>

    <img
      :src="imgSrc"
      :alt="product?.name || ''"
      class="product-image"
      loading="lazy"
      @error="onImgErr"
    />

    <p class="product-price">{{ formatCurrency(product?.price) }} VND</p>
    <p class="product-description">{{ product?.name }}</p>

    <button @click.stop="onAddCart(product)">Thêm vào giỏ hàng</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { useCart } from '@/stores/cart'
import NoImage from '@/assets/Petstore_Logo.png'


const props = defineProps({
  product: { type: Object, required: true },
})

const router = useRouter()
const cartStore = useCart()

// src ảnh dùng ref + fallback cục bộ
const imgSrc = ref(props.product?.picture || NoImage)
watch(
  () => props.product?.picture,
  (val) => { imgSrc.value = val || NoImage }
)

// nếu ảnh lỗi -> gán sang fallback (tránh loop)
function onImgErr() {
  if (imgSrc.value !== NoImage) imgSrc.value = NoImage
}

function formatCurrency(val) {
  const n = Number(val ?? 0)
  return new Intl.NumberFormat('vi-VN').format(isNaN(n) ? 0 : n)
}

function onClick() {
  const id = props?.product?.id
  if (!id) return
  router.push({
    name: 'product-detail',
    params: { id: String(id) },
    state: { pet: props.product },
  })
}

function onAddCart(item) {
  cartStore.addCart(item)
  notify({ title: 'Thêm sản phẩm', text: 'Thêm sản phẩm vào giỏ hàng thành công!' })
}
</script>

<style lang="scss" scoped>
.product-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 200px;
  margin: 10px;
  padding: 9px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
  transition: transform .15s ease;
  &:hover { transform: scale(1.008); cursor: pointer; }

  .product-image {
    width: 100%;
    height: 50%;
    min-height: 150px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    border-radius: 10px;
    object-fit: cover;
  }

  .product-price { color: #e74c3c; font-weight: 700; margin: 10px 0; }

  .product-description {
    color: #000;
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sale {
    position: absolute; top: .25rem; right: .25rem;
    background: #e11; color: #fff; font-weight: 700;
    padding: .25rem 1rem; border-radius: .75rem;
    border: 1px solid #fff; box-shadow: -4px 4px 2px rgba(242,227,227,.8);
  }

  button {
    height: 40px;
    border-radius: 40px;
    background: rgb(243,5,96);
    border: none; outline: none; color: #fff;
    font-size: 1rem; font-weight: 500; width: 100%;
    transition: all .4s ease;
  }
}
</style>
