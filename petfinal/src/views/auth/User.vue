<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">
        {{ route.meta.title || "Quản lý thông tin người dùng" }}
      </div>
    </div>
    <Loading v-if="state.loading" />
    <template v-else>
      <div class="table-responsive">
        <table class="table table-hover caption-top">
          <caption>
            <ToolSearchBase @submitSearch="onSearch" />
          </caption>
          <thead>
            <tr>
              <th scope="col" v-for="col in COLS" :key="`th-${col.key}`">
                {{ col.title }}
              </th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, inx) in paginatedUsers" :key="user.id">
              <td>{{ toIndex(inx) }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>{{ formatDateTime(user.last_login) }}</td>
              <td>{{ formatDate(user.create_at) }}</td>
              <td>{{ user.address }}</td>
              <td class="tb-action">
                <span
                  class="action"
                  @click="
                    () =>
                      router.push({
                        name: 'user-edit',
                        params: { id: user.id },
                      })
                  "
                >
                  <img src="/images/edit.svg" alt="Edit" />
                </span>
                <span>|</span>
                <span class="action" @click="onDelete(user.id)">
                  <img src="/images/delete.svg" alt="Delete" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          :total-pages="totalPages"
          @pageChange="onChangePage"
          :page="state.page"
          :total="totalUsers"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
const COLS = [
  { key: "id", title: "#" },
  { key: "username", title: "Tên" },
  { key: "email", title: "Email" },
  { key: "role", title: "Vai trò" },
  { key: "last_login", title: "Lần đăng nhập" },
  { key: "create_at", title: "Ngày tạo" },
  { key: "address", title: "Địa chỉ" },
];

import { onMounted, reactive, computed, watch } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Loading from "@/components/Loading.vue";
import ToolSearchBase from "@/components/ToolSearchBaseContac.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const state = reactive({
  users: [],
  loading: false,
  page: 1,
  limit: 10,
  searchQuery: "",
});

const totalUsers = computed(() => state.users.length);
const totalPages = computed(() => Math.ceil(totalUsers.value / state.limit));

const filteredUsers = computed(() => {
  if (!state.searchQuery) return state.users;
  const search = state.searchQuery.toLowerCase();
  return state.users.filter(
    (user) =>
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.address.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search) ||
      String(user.id).includes(search)
  );
});

const paginatedUsers = computed(() => {
  const start = (state.page - 1) * state.limit;
  return filteredUsers.value.slice(start, start + state.limit);
});

function onChangePage(page) {
  state.page = page;
}

function onSearch(search) {
  state.searchQuery = search;
  state.page = 1;
}

function onLoadData() {
  state.loading = true;

  userStore
    .fetchUsers({})
    .then((data) => {
      state.users = data.list || [];
      state.loading = false;
    })
    .catch((err) => {
      console.error(err);
      state.loading = false;
    });
}

async function onDelete(id) {
  try {
    await userStore.deleteUser(id);
    notify({ title: "Thông báo", text: "Thao tác xóa người dùng thành công!" });
    onLoadData();
  } catch (error) {
    notify({
      type: "error",
      title: "Thông báo",
      text: "Thao tác không thành công!!!",
    });
  }
}

watch(
  () => route.query.s,
  (newSearch) => {
    state.searchQuery = newSearch || "";
    onLoadData();
  }
);

onMounted(() => {
  onLoadData();
});

function toIndex(inx) {
  return inx + 1 + (state.page - 1) * state.limit;
}

function formatDate(date) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - 7); // Trừ đi 7 tiếng
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return newDate.toLocaleDateString(undefined, options);
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  date.setHours(date.getHours() - 7); // Trừ đi 7 tiếng
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString(undefined, options);
}
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
  padding: 20px;

  .h3 {
    font-size: 24px;
    font-weight: bold;
  }

  .table-responsive {
    margin-top: 20px;

    .table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      thead {
        background-color: #f8f9fa;
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: #495057;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid #dee2e6;

          td {
            padding: 12px;
            font-size: 14px;
            color: #495057;
          }

          &:hover {
            background-color: #f1f3f5;
          }
        }
      }

      caption {
        margin-bottom: 15px;
        padding: 5px;
        text-align: left;
      }
    }

    .tb-action {
      display: flex;
      gap: 12px;
      justify-content: center;
      align-items: center;

      .action {
        cursor: pointer;

        img {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .table {
    font-size: 12px;

    th, td {
      padding: 10px;
    }

    .tb-action {
      gap: 6px;
    }
  }

  .pagination-wrapper {
    flex-direction: column;
    margin-top: 10px;
  }

  .h3 {
    font-size: 20px;
  }
}

</style>
