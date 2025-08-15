<template>
  <div class="pet-wrapper">
    <Loading v-if="state.busy"></Loading>
    <template v-else>
      <div class="pet-hot">
        <aside id="menu">
          <h3 class="menu-title">Danh mục</h3>
          <ul class="menus">
            <li v-for="mCat in state.cats" :key="`cat-${mCat.id}`">
              <a href="#" @click="goPage(mCat.id)"> {{ mCat.name }}</a>
              <!-- /Thucanmeo/index.html -->
            </li>
          </ul>
        </aside>
        <article id="content">
          <div
            v-if="state.loading"
            class="d-flex justify-content-center align-items-center mt-4"
          >
            <Loading></Loading>
          </div>
          <div class="product-container" v-else>
            <template v-if="state.pets && state.pets.length > 0">
              <ProductItem
                v-for="pet in state.pets"
                :product="pet"
                :key="pet.name"
                :route="props.route"
              />
            </template>
            <div class="w-100 text-center" v-else> 
              <div class="d-flex justify-content-center align-items-center flex-column">
                <img src="/src/assets/icons/out-of-stock.png" class="d-block mx-auto" alt="hết hàng" />
              <p class="text-danger mt-2">Sản phẩm đã hết hàng ===> Vui lòng chọn sản phẩm khác</p> 
              </div> 
            </div>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<script setup>
import ProductItem from "./ProductItem.vue";
import { onMounted, reactive } from "vue";
import Loading from "@/components/Loading.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps(["api", "route", "cat"]);
const state = reactive({ pets: [], busy: true, cats: [], loading: true });

function onLoadData() {
  const cat_pro = route.query?.cat_pro;
  fetchData(cat_pro);
}

const fetchData = (cat_pro) => {
  state.loading = true;
  let whereClause = "limit=100";
  if (cat_pro) {
    whereClause += `&cat_pro=${cat_pro}`;
  }

  props
    .api(whereClause)
    .then((data) => {
      if (data.list) state.pets = data.list;
      if (data?.cats?.list) {
        state.cats = data.cats.list;
      }
      state.busy = false;
      state.loading = false;
    })
    .catch((err) => console.log(err));
};

const goPage = (cat_pro) => {
  fetchData(cat_pro);
  router.replace({ name: props.route, query: { cat_pro } });
};

onMounted(() => onLoadData());
</script>

<style lang="scss" scoped>
.pet-wrapper {
  background-color: rgba(255, 255, 255, 0.5);
  min-height: 50vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  align-items: center;

  gap: 1rem;

  .pet-hot {
    width: 100%;
    display: flex;
    min-height: 50vh;

    #menu {
      width: 220px;
      background: #fff;
      padding-left: 1rem;
      align-self: stretch;

      .menu-title {
        color: #f80a0a;
        font-size: 23px;
        font-weight: bold;
        border-bottom: 1px solid #cdcdcd;
        padding: 1rem 0;
      }

      .menus {
        list-style-type: none;
        margin-left: 0px;
        padding-left: 0;

        li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #cdcdcd;
          margin-right: 0.5rem;

          a {
            color: #000;
            font-weight: bold;
            text-decoration: none;

            &:hover,
            &:active {
              color: #f80a0a;
              background: transparent;
            }
          }
        }
      }

      @media only screen and (max-width: 768px) {
        display: none;
      }
    }

    #content {
      width: 100%;
      align-self: stretch;

      .product-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.5rem;
        padding: 0.5rem;
        background-color: #f9f9f9;
        justify-content: center;
      }
    }
  }
}
</style>