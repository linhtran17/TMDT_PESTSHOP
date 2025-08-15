<template>
  <div class="search-product container">
    <h2>Kết quả tìm kiếm: "{{ searchQuery }}"</h2>
    <div v-if="state.busy" class="text-center">
      <Loading />
    </div>
    <div v-else-if="state.pets.length === 0" class="text-center">
      <p>Không tìm thấy sản phẩm nào.</p>
    </div>
    <div v-else class="product-list row">
      <div v-for="pet in state.pets" :key="pet.id" class="col-md-4 mb-4">
        <div class="card product-item">
          <img :src="pet.picture" class="card-img-top" :alt="pet.name" />
          <div class="card-body">
            <h5 class="card-title">{{ pet.name }}</h5>
            <p class="card-text">Giá: {{ formatCurrency(pet.price) }}</p>
            <router-link
              :to="{ name: 'product-detail', params: { id: pet.id } }"
              class="btn btn-primary"
            >
              Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      v-if="state.totalPages > 1"
      :total-pages="state.totalPages"
      @pageChange="onChangePage"
      :page="state.page"
      :total="state.total"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import petApi from "@/api/product";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";

const route = useRoute();
const router = useRouter();
const searchQuery = route.query.s || "";
const state = reactive({
  pets: [],
  busy: true,
  page: parseInt(route.query.page) || 1,
  totalPages: 0,
  limit: 9,
  total: 0,
});

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function onChangePage(page) {
  state.page = page;
  router.push({
    name: "search-product",
    query: { s: searchQuery, page },
  });
}

function loadData() {
  state.busy = true;
  const params = {
    s: searchQuery,
    limit: state.limit,
    page: state.page,
  };
  petApi
    .pets(new URLSearchParams(params).toString())
    .then(({ list, totalPages, total }) => {
      state.pets = list;
      state.totalPages = totalPages;
      state.total = total;
      state.busy = false;
    })
    .catch((err) => {
      console.log(err);
      state.busy = false;
    });
}

onMounted(() => {
  if (searchQuery) loadData();
  else state.busy = false;
});

watch(
  () => route.query.s,
  (newSearch) => {
    if (newSearch !== searchQuery) {
      state.page = 1;
      loadData();
    }
  }
);
</script>

<style lang="scss" scoped>
.search-product {
  padding: 2rem 0;

  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #333;
  }

  .product-list {
    .product-item {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .card-img-top {
        height: 200px;
        object-fit: cover;
      }

      .card-body {
        text-align: center;

        .card-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .card-text {
          color: #28a745;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .btn-primary {
          background-color: #e94560;
          border-color: #e94560;
          &:hover {
            background-color: #d43c56;
            border-color: #d43c56;
          }
        }
      }
    }
  }
}
</style>