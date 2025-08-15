<template>
    <div class="product-item" @click="onClick(props.product)">
        <img class="picture" :src="props.product.picture" />
        <div class="extention">
            <div class="Name">
                <b ></b> {{ props.product.name }}
            </div>
            <div class="Loai">
                <b>Loại: </b>  {{ props.product.loai }}
            </div>
            <div class="Price">
                <b></b> {{ props.product.price }}
            </div>
            <button class="btn btn-primary"> + Thêm Giỏ Hàng</button>
            
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps(['product'])


function onClick(product) {
    router.push({ name: 'product-detail', params: { id: props?.product?.id }, meta: { product: props.product } })
}

</script>

<style lang="scss" scoped>
.product-item {
    width: 230px;
    border-radius: 1rem;
    border: 1px solid #cdcdcd;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background-color: #fff;

    &:hover {
        border-width: 2px;
        cursor: pointer;
    }

    .name {
        font-weight: 600;
        padding: 0.5rem 1rem;
        background-color: #cdcdcd;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }

    .picture {
        width: calc(100% - 2rem);
        margin: 0 auto;
        margin: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0px;

    }

    .extention {
        padding: 1rem;

        .price {
            b {
                font-weight: 600;
            }
        }

    }
    .sale-badge {
    font-size: 1.1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;}
    
}


</style>