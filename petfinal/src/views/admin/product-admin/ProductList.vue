<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">{{ route.meta.title }}</div>
    </div>
    <Loading v-if="state.busy"></Loading>
    <template v-else>
      <div class="table-responsive">
        <table class="table table-hover caption-top">
          <caption>
            <ToolSearchBase
              :add-link="'/admin/product-add'"
              @submitSearch="onLoadData"
            />
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
            <tr v-for="(pet, inx) in state.pets" :pet="pet" :key="pet.name">
              <td>{{ toIndex(inx) }}</td>
              <td>{{ pet.name }}</td>
              <td><img width="40" :src="pet.picture" /></td>
              <td>{{ formatCurrency(pet.price) }}</td>
              <td>{{ pet?.catPro?.name }}</td>
              <td>{{ pet?.catPet?.name }}</td>
              <td>
                <div class="tb-action">
                  <span class="action" @click="onEdit(pet.id)">
                    <img src="/images/edit.svg" />
                  </span>
                  <span>|</span>
                  <span class="action" @click="onDelete(pet.id)">
                    <img src="/images/delete.svg" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          :total-pages="state.totalPages"
          @pageChange="onChangePage"
          :page="state.page"
          :total="state.total"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
const COLS = [
  { key: "id", title: "ID" },
  { key: "name", title: "Tên" },
  { key: "picture", title: "Hình ảnh" },
  { key: "price", title: "Giá" },
  { key: "cat_pro", title: "Loại sản phẩm" },
  { key: "cat_pet", title: "Thú cưng" },
  { key: "action", title: "Thao tác" },

];

import { onMounted, reactive } from "vue";
import { notify } from "@kyvg/vue3-notification";
import petApi from "@/api/product";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import ToolSearchBase from "@/components/ToolSearchBase.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();
const route = useRoute();
const state = reactive({
  pets: [],
  busy: true,
  page: route.page || 1,
  totalPages: 0,
  limit: 10,
  total: 0,
});

function onChangePage(page) {
  state.page = page;
  onLoadData(route.query.s);
}

function onLoadData(search) {
  const params = { limit: state.limit, page: state.page };
  if (search) {
    params.s = search;
    router.push({ query: { ...route.query, s: search } });
  }

  petApi
    .pets(new URLSearchParams(params).toString())
    .then(({ list, totalPages, total }) => {
      state.pets = list;
      state.totalPages = totalPages;
      state.total = total;
      state.busy = false;
    })
    .catch((err) => console.log(err));
}

const onEdit = (id) => {
  router.push({ name: "product-edit", params: { id } });
};

async function onDelete(id) {
  try {
    await petApi.delete(id);
    notify({ title: "Thông báo", text: "Thao tác thành công!" });
    onLoadData();
  } catch (error) {
    notify({
      type: "error",
      title: "Thông báo",
      text: "Thao tác không thành công!!!",
    });
  }
}

onMounted(() => {
  onLoadData();
});

function toIndex(inx) {
  return inx + 1 + (state.page - 1) * state.limit;
}
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;

  .table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 8px 10px; 
      text-align: center;
      vertical-align: middle; 
      font-size: 1rem;
    }

    th {
      font-weight: bold;
      background-color: #f8f9fa;
      color: #333;
      border-bottom: 2px solid #dee2e6;
      text-transform: uppercase;
      font-size: 1.25rem;
    }

    td {
      border-bottom: 1px solid #dee2e6;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    td:first-child {
      font-weight: bold;
      color: #6c757d;
      width: 5%;
    }

    td:nth-child(2) {
      width: 20%;
      font-weight: 500;
      color: #343a40;
    }

    td:nth-child(3) img {
      width: 40px;
      height: 40px;
      object-fit: cover;
    }

    td:nth-child(4) {
      width: 20%;
      text-align: center;
      color: #28a745;
      font-weight: bold;
      padding: 0 10px;
    }

    td:nth-child(5),
    td:nth-child(6) {
      width: 15%;
      font-style: italic;
      color: #495057;
    }

    tr:hover {
      background-color: #f4f4f4; /* Màu nền khi di chuột qua dòng */
    }

    .tb-action {
      display: flex;
      gap: 4px;
      justify-content: center;
      align-items: center;

      .action {
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #f1f1f1;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>
