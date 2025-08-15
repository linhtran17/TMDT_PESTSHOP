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
              :add-link="'/admin/news-add'"
              @submitSearch="onLoadData"
            />
          </caption>
          <thead>
            <tr>
              <th scope="col" v-for="col in COLS" :key="`th-${col.key}`">
                {{ col.title || "" }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(news, inx) in state.news"
              :key="news.id"
            >
              <td>{{ toIndex(inx) }}</td>
              <td>{{ news.tieude }}</td>
              <td>
                <img v-if="news.hinhanh" width="40" :src="`/api/media/${news.hinhanh}`" />
                <span v-else>Không có ảnh</span>
              </td>
              <td>
                <div class="tb-action">
                  <span class="action" @click="onEdit(news.id)">
                    <img src="/images/edit.svg" />
                  </span>
                  <span>|</span>
                  <span class="action" @click="onDelete(news.id)">
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
  { key: "tieude", title: "Tiêu đề" },
  { key: "hinhanh", title: "Hình ảnh" },
  { key: "action", title: "Thao tác" },
];

import { onMounted, reactive } from "vue";
import { notify } from "@kyvg/vue3-notification";
import newsApi from "@/api/news";
import { useRoute, useRouter } from "vue-router";
import Loading from "@/components/Loading.vue";
import ToolSearchBase from "@/components/ToolSearchBase.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();
const route = useRoute();
const state = reactive({
  news: [],
  busy: true,
  page: route.query.page || 1,
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

  newsApi
    .news(new URLSearchParams(params).toString())
    .then(({ list, totalPages, total }) => {
      state.news = list;
      state.totalPages = totalPages;
      state.total = total;
      state.busy = false;
    })
    .catch((err) => {
      console.error("Lỗi khi tải danh sách tin tức:", err);
      state.busy = false;
    });
}

function onEdit(id) {
  router.push({ name: 'news-edit', params: { id } });
}

async function onDelete(id) {
  try {
    await newsApi.delete(id);
    notify({ title: "Thông báo", text: "Xóa thành công!", type: "success" });
    onLoadData();
  } catch (error) {
    console.error("Lỗi khi xóa tin tức:", error);
    notify({
      type: "error",
      title: "Thông báo",
      text: "Xóa không thành công!",
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
    }

    td:nth-child(5),
    td:nth-child(6) {
      width: 15%;
      font-style: italic;
      color: #495057;
    }

    tr:hover {
      background-color: #f4f4f4;
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