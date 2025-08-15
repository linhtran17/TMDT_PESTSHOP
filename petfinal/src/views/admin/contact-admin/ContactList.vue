<template>
  <div class="main-wrap">
    <div class="mb-3 d-flex justify-content-between">
      <div class="h3">{{ route.meta.title || "Quản lý liên hệ" }}</div>
      <div class="Filter">
        <label for="statusFilter">Lọc theo trạng thái:</label>
        <select
          id="statusFilter"
          v-model="state.statusFilter"
          @change="onLoadData"
        >
          <option value="">Tất cả</option>
          <option value="0">Chưa đọc</option>
          <option value="1">Đã đọc</option>
        </select>
      </div>
    </div>
    <Loading v-if="state.loading" />
    <template v-else>
      <div class="table-responsive">
        <table class="table table-hover caption-top">
          <caption>
            <ToolSearchBase @submitSearch="onSearch" />
          </caption>
          <thead class="rows">
            <tr>
              <th scope="col" v-for="col in COLS" :key="`th-${col.key}`">
                {{ col.title }}
              </th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, inx) in paginatedContacts" :key="contact.id">
              <td>{{ toIndex(inx) }}</td>
              <td>{{ contact.name }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.phone }}</td>
              <td @click="onShowContent(contact.content)" class="content-cell">
                <span class="truncate-text">{{ contact.content }}</span>
              </td>
              <td>
                <select
                  v-model="contact.status"
                  class="color"
                  @change="onUpdateStatus(contact.id, contact.status)"
                >
                  <option value="0">Chưa đọc</option>
                  <option value="1">Đã đọc</option>
                </select>
              </td>
              <td>{{ formatDateTime(contact.created_at) }}</td>
              <td class="tb-action">
                <span class="action" @click="onDelete(contact.id)">
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
          :total="totalContacts"
        />
      </div>
    </template>

    <!-- Modal hiển thị nội dung -->
    <div v-if="state.showModal" class="modal-overlay">
      <div class="modal-content">
        <h5>Nội dung chi tiết</h5>
        <p>{{ state.modalContent }}</p>
        <button class="btn btn-secondary" @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const COLS = [
  { key: "id", title: "#" },
  { key: "name", title: "Tên" },
  { key: "email", title: "Email" },
  { key: "phone", title: "Số điện thoại" },
  { key: "content", title: "Nội dung" },
  { key: "status", title: "Trạng thái" },
  { key: "created_at", title: "Ngày tạo" },
];

import { onMounted, reactive, computed } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { useRoute, useRouter } from "vue-router";
import { useContactStore } from "@/stores/contactadmin";
import Loading from "@/components/Loading.vue";
import ToolSearchBase from "@/components/ToolSearchBaseContac.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();
const route = useRoute();
const contactStore = useContactStore();

const state = reactive({
  contacts: [],
  loading: false,
  page: 1,
  limit: 100,
  searchQuery: "",
  statusFilter: "",
  showModal: false, // Trạng thái hiển thị modal
  modalContent: "", // Nội dung để hiển thị trong modal
});

const totalContacts = computed(() => state.contacts.length);
const totalPages = computed(() => Math.ceil(totalContacts.value / state.limit));

const filteredContacts = computed(() => {
  let contacts = state.contacts;

  if (state.searchQuery) {
    const search = state.searchQuery.toLowerCase();
    contacts = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.title.toLowerCase().includes(search) ||
        contact.content.toLowerCase().includes(search) ||
        (search === "chưa đọc" && contact.status === 0) ||
        (search === "đã đọc" && contact.status === 1) ||
        String(contact.id).includes(search)
    );
  }

  if (state.statusFilter) {
    contacts = contacts.filter(
      (contact) => String(contact.status) === state.statusFilter
    );
  }

  return contacts;
});

const paginatedContacts = computed(() => {
  const start = (state.page - 1) * state.limit;
  return filteredContacts.value.slice(start, start + state.limit);
});

function onChangePage(page) {
  state.page = page;
  onLoadData();
}

function onSearch(search) {
  state.searchQuery = search;
  state.page = 1;
  onLoadData();
}

function onLoadData() {
  state.loading = true;

  contactStore
    .fetchContacts(
      new URLSearchParams({
        limit: state.limit,
        page: state.page,
        s: state.searchQuery,
        status: state.statusFilter,
      }).toString()
    )
    .then(() => {
      state.contacts = contactStore.contacts;
      state.loading = false;
    })
    .catch((err) => {
      console.error(err);
      state.loading = false;
    });
}

async function onDelete(id) {
  try {
    await contactStore.deleteContact(id);
    notify({ title: "Thông báo", text: "Thao tác xóa liên hệ thành công!" });
    onLoadData();
  } catch (error) {
    notify({
      type: "error",
      title: "Thông báo",
      text: "Thao tác không thành công!!!",
    });
  }
}

async function onUpdateStatus(id, status) {
  try {
    await contactStore.updateContactStatus(id, status);
    notify({ title: "Thông báo", text: "Cập nhật trạng thái thành công!" });
  } catch (error) {
    notify({
      type: "error",
      title: "Thông báo",
      text: "Cập nhật trạng thái không thành công!!!",
    });
  }
}

// Hiển thị modal nội dung
function onShowContent(content) {
  state.modalContent = content;
  state.showModal = true;
}

// Đóng modal
function closeModal() {
  state.showModal = false;
}

onMounted(async () => {
  onLoadData();
});
function toIndex(inx) {
  return inx + 1 + (state.page - 1) * state.limit;
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  date.setHours(date.getHours() - 7); // Trừ đi 7 giờ
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
}
.tb-action {
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;

  .action {
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }
}
.color {
  color: rgb(228, 15, 50);
  border-radius: 10%;
}
.color:hover {
  background-color: rgb(151, 128, 132);
}
.Filter {
  font-display: initial;
  font-size: larger;
}
#statusFilter {
  color: rgb(228, 15, 50);
}

/* Fix for long content */
.table-responsive {
  overflow-x: auto;
}

.table-hover tbody tr td {
  max-width: 200px; /* Adjust this value as needed */
  word-wrap: break-word;
}

th,
td {
  vertical-align: middle; /* Ensure vertical alignment */
}
td.tb-action {
  white-space: nowrap; /* Ngăn chữ xuống dòng */
}
.table-hover {
  table-layout: auto; /* Cho phép các cột thay đổi kích thước theo nội dung */
  width: 100%; /* Bảng chiếm toàn bộ chiều rộng */
}

th,
td {
  vertical-align: middle;
  word-wrap: break-word;
}

td.tb-action {
  min-width: 80px; /* Điều chỉnh giá trị này tùy nhu cầu */
  white-space: nowrap; /* Giữ nội dung không bị xuống dòng */
}
td {
  overflow: hidden;
  text-overflow: ellipsis; /* Hiển thị dấu "..." nếu nội dung quá dài */
  white-space: nowrap; /* Không xuống dòng */
}

.table-responsive {
  overflow-x: auto; /* Bật cuộn ngang nếu nội dung vượt quá bảng */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-content p {
  max-height: 300px;
  overflow-y: auto;
}

.content-cell {
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;
}
</style>
