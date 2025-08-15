<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/news" class="h3">{{ route.meta.title }}</router-link>
        <div class="px-2">/</div>
        <div class="h3">{{ state.title }}</div>
      </div>
    </div>
    <div>
      <div class="mb-3">
        <label for="tieude" class="form-label">Tiêu đề</label>
        <input
          type="text"
          class="form-control"
          id="tieude"
          placeholder="Nhập tiêu đề"
          v-model="state.news.tieude"
          @input="validateTieude"
          required
        />
        <div v-if="state.errors.tieude" class="text-danger">{{ state.errors.tieude }}</div>
      </div>
      <div class="mb-3">
        <label for="noidung" class="form-label">Nội dung</label>
        <textarea
          class="form-control"
          id="noidung"
          placeholder="Nhập nội dung"
          v-model="state.news.noidung"
          rows="4"
          @input="validateNoidung"
          required
        ></textarea>
        <div v-if="state.errors.noidung" class="text-danger">{{ state.errors.noidung }}</div>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Mô tả</label>
        <textarea
          class="form-control"
          id="description"
          placeholder="Nhập mô tả"
          v-model="state.news.description"
          rows="2"
          @input="validateDescription"
        ></textarea>
        <div v-if="state.errors.description" class="text-danger">{{ state.errors.description }}</div>
      </div>
      <div class="mb-3">
        <label for="file" class="form-label">Tải lên hình ảnh</label>
        <input type="file" class="form-control" id="file" @change="onFileChange" accept="image/*" />
        <div v-if="state.errors.file" class="text-danger">{{ state.errors.file }}</div>
        <small v-if="state.news.hinhanh" class="form-text text-muted">
          Ảnh hiện tại: {{ state.news.hinhanh }}
        </small>
      </div>
      <div class="mb-3">
        <label for="published_date" class="form-label">Ngày xuất bản</label>
        <input
          type="date"
          class="form-control"
          id="published_date"
          v-model="state.news.published_date"
          @input="validatePublishedDate"
          required
        />
        <div v-if="state.errors.published_date" class="text-danger">{{ state.errors.published_date }}</div>
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Trạng thái</label>
        <select class="form-control" id="status" v-model="state.news.status" @change="validateStatus" required>
          <option value="draft">Bản nháp</option>
          <option value="published">Đã xuất bản</option>
        </select>
        <div v-if="state.errors.status" class="text-danger">{{ state.errors.status }}</div>
      </div>
      <div class="w-100">
        <button @click="onSave" class="btn btn-primary w-100" :disabled="state.busy">
          {{ state.busy ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import newsApi from "@/api/news";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: false,
  title: "Thêm mới",
  fileSelected: null,
  news: {
    id: null,
    tieude: "",
    noidung: "",
    hinhanh: "",
    description: "",
    published_date: new Date().toISOString().split("T")[0],
    status: "draft",
  },
  errors: {
    tieude: "",
    noidung: "",
    description: "",
    file: "",
    published_date: "",
    status: ""
  }
});

function validateTieude() {
  state.errors.tieude = "";
  if (!state.news.tieude) {
    state.errors.tieude = "Tiêu đề không được để trống";
  } else if (state.news.tieude.length > 255) {
    state.errors.tieude = "Tiêu đề không được vượt quá 255 ký tự";
  } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(state.news.tieude)) {
    state.errors.tieude = "Tiêu đề không được chứa ký tự đặc biệt";
  }
}

function validateNoidung() {
  state.errors.noidung = "";
  if (!state.news.noidung) {
    state.errors.noidung = "Nội dung không được để trống";
  }
}

function validateDescription() {
  state.errors.description = "";
  if (!state.news.description) {
    state.errors.description = "Mô tả không được để trống";
  }
}

function validatePublishedDate() {
  state.errors.published_date = "";
  if (!state.news.published_date) {
    state.errors.published_date = "Ngày xuất bản không được để trống";
  } else if (isNaN(Date.parse(state.news.published_date))) {
    state.errors.published_date = "Ngày xuất bản không hợp lệ";
  }
}

function validateStatus() {
  state.errors.status = "";
  if (!["published", "draft"].includes(state.news.status)) {
    state.errors.status = "Trạng thái không hợp lệ";
  }
}

function onFileChange(event) {
  state.errors.file = "";
  const file = event.target.files[0];
  if (!file) {
    state.errors.file = "Vui lòng chọn một file ảnh";
    state.fileSelected = null;
    return;
  }
  if (!file.type.startsWith('image/')) {
    state.errors.file = "Vui lòng chọn file ảnh (PNG, JPG, ...)";
    state.fileSelected = null;
    notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    state.errors.file = "File quá lớn, tối đa 5MB";
    state.fileSelected = null;
    notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.fileSelected = file;
  };
  reader.onerror = () => {
    state.errors.file = "Không thể đọc file, vui lòng thử file khác";
    state.fileSelected = null;
    notify({ title: "Thông báo", text: state.errors.file, type: 'warn' });
  };
  reader.readAsDataURL(file);
}

async function fetchNewsById(id) {
  try {
    state.busy = true;
    const data = await newsApi.getById(id);
    if (data) {
      state.news = {
        id: data.id,
        tieude: data.tieude || "",
        noidung: data.noidung || "",
        hinhanh: data.hinhanh || "",
        description: data.description || "",
        published_date: data.published_date
          ? new Date(data.published_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: data.status || "draft",
      };
      state.title = "Cập nhật";
    } else {
      throw new Error("Không tìm thấy tin tức");
    }
  } catch (error) {
    console.error("Lỗi khi tải tin tức:", error);
    notify({ title: "Thông báo", text: "Không tải được tin tức!", type: "error" });
  } finally {
    state.busy = false;
  }
}

async function onSave() {
  state.busy = true;
  validateTieude();
  validateNoidung();
  validateDescription();
  validatePublishedDate();
  validateStatus();

  if (!state.fileSelected && !state.news.hinhanh && !route.params.id) {
    state.errors.file = "Vui lòng chọn một file ảnh";
  }

  if (Object.values(state.errors).some(error => error)) {
    notify({ title: "Thông báo", text: "Vui lòng kiểm tra lại các trường thông tin", type: 'warn' });
    state.busy = false;
    return;
  }

  try {
    if (state.fileSelected) {
      const formData = new FormData();
      formData.append('file', state.fileSelected);
      const data = await newsApi.uploadImage(formData);
      if (data?.filename) {
        state.news.hinhanh = data.filename;
        state.fileSelected = null;
      } else {
        notify({ title: "Thông báo", text: "Upload ảnh thất bại", type: 'warn' });
        state.busy = false;
        return;
      }
    }

    const newsData = {
      tieude: state.news.tieude,
      noidung: state.news.noidung,
      hinhanh: state.news.hinhanh,
      description: state.news.description || '',
      published_date: state.news.published_date,
      status: state.news.status,
    };

    console.log('Dữ liệu gửi:', newsData);

    if (route.params.id) {
      await newsApi.edit(route.params.id, newsData);
    } else {
      await newsApi.add(newsData);
    }

    notify({ title: "Thông báo", text: "Thao tác thành công!", type: "success" });
    router.push({ name: "admin-news" });
  } catch (error) {
    console.error("Lỗi chi tiết:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    notify({ title: "Thông báo", text: error.message || "Thao tác không thành công!", type: "error" });
  } finally {
    state.busy = false;
  }
}

onBeforeMount(() => {
  state.fileSelected = null;
  if (route.params.id) {
    fetchNewsById(route.params.id);
  }
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
.text-danger {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>