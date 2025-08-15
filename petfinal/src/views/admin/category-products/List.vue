<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">{{ route.meta.title }}</div>
    </div>
    <MyLoading v-if="state.busy" />
    <template v-else>
      <div class="table-responsive mt-3">
        <table class="table table-hover caption-top">
          <caption>
            <div class="form-search">
              <form @submit="onLoadData($event)">
                <div class="input-group">
                  <input type="search" class="form-control" placeholder="Nhập để tìm kiếm..." aria-label="input-search"
                    v-model="state.search" aria-describedby="button-addon2">
                  <button class="btn btn-outline-secondary" type="button" id="button-addon2">Tìm kiếm</button>
                </div>
              </form>
              <div>
                <router-link class="btn btn-danger" to="/admin/cat-pro-add">Thêm mới</router-link>
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th scope="col" v-for="col in COLS" :key="`th-${col.key}`">
                {{ col.title }}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, inx) in state.items" :key="item.name">
              <td>{{  (state.page - 1) * state.limit + (inx + 1) }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.petName }}</td>
              <td class="tb-action">
                <span class="action" @click="() =>
                  router.push({
                    name: 'cat-pro-edit',
                    params: { id: item.id },
                  })
                  ">
                  <img src="/images/edit.svg" />
                </span>
                <span>|</span>
                <span class="action" @click="onDelete(item.id)">
                  <img src="/images/delete.svg" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination :total-pages="state.totalPages" @pageChange="onChangePage" :page="state.page" :total="state.total" />
      </div>
    </template>
  </div>
</template>

<script setup>
const COLS = [
  { key: "id", title: "ID" },
  { key: "name", title: "Danh mục thương hiệu" },
  { key: "petName", title: "Loại thú cưng" },
];

import { onMounted, reactive, onBeforeMount } from "vue";
import { notify } from "@kyvg/vue3-notification";
import api from "@/api/cat-product";
import { useRoute, useRouter } from "vue-router";
import MyLoading from '@/components/Loading.vue';
import Pagination from "@/components/Pagination.vue";

const router = useRouter();
const route = useRoute();
const state = reactive({ pets: [], busy: true, search: route.query?.s || "", totalPages: 0, page: route.page || 1, total: 0, limit: 10 });

function onChangePage(page) {
  state.page = page
  onLoadData(route.query.s)
}


function onLoadData(search) {
  const params = { limit: state.limit, page: state.page };
  if (search) {
    params.s = search
    router.push({ query: { ...route.query, s: search } })
  }

  api
    .find(new URLSearchParams(params).toString())
    .then(({ list, totalPages, total }) => {
      state.items = list;
      state.totalPages = totalPages
      state.total = total
      state.busy = false;
    })
    .catch((err) => console.log(err));
}

async function onDelete(id) {
  try {
    await api.delete(id);
    notify({ title: "Thông tin", text: "Thao tác thành công!" });
    onLoadData();
  } catch (error) {
    notify({ type: "error", title: "Thông tin", text: "Thao tác không thành công!!!", type: "warn" });
  }
}

onBeforeMount(() => {
  router.replace({ query: { ...route.query, page: route.page } })
  onLoadData()
})

</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;

  .form-search {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: flex-end;
    margin-bottom: 1rem;
    .form-control {
      &:focus {
        box-shadow: none;
      }
    }
  }

  .tb-action {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
    align-items: center;

    .action {
      cursor: pointer;

      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>