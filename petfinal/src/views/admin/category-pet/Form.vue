<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/cat-pets" class="h3">Quản lý loại thú cưng</router-link>
        <div class="px-2">/</div>
        <div class="h3">{{ state.title }}</div>
      </div>
    </div>
    <MyLoading v-if="state.busy" />
    <div>
      <div class="mb-3">
        <label for="name" class="form-label">Tên loại</label>
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập loại"
          v-model="state.pet.name"
          :class="{ 'is-invalid': state.errors.name }"
        />
        <div v-if="state.errors.name" class="invalid-feedback">
          {{ state.errors.name }}
        </div>
      </div>
      <div class="">
        <div @click="onSave" class="btn btn-primary">Lưu</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import api from "@/api/cat-pet";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import MyLoading from "@/components/Loading.vue";

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: false,
  title: "Thêm mới quản lý loại thú cưng",
  pet: {
    id: null,
    name: "",
  },
  errors: {
    name: "",
  },
});

// Hàm validate tên
function validateName(name) {
  if (!name.trim()) {
    return "Vui lòng nhập tên";
  }
  if (name.length < 2 || name.length > 50) {
    return "Tên phải từ 2 đến 50 ký tự";
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
    return "Tên chỉ được chứa chữ cái, số và khoảng trắng";
  }
  return "";
}

async function onSave() {
  // Xác thực trường tên
  const nameError = validateName(state.pet.name);
  if (nameError) {
    state.errors.name = nameError;
    return;
  } else {
    state.errors.name = "";
  }

  state.busy = true;
  try {
    if (route.params.id) {
      await api.edit(route.params.id, state.pet);
      state.title = "Cập nhật quản lý loại thú cưng";
    } else {
      await api.add(state.pet);
    }
    notify({ title: "Thông tin", text: "Thao tác thành công!", type: "success" });
    router.push({ name: "cat-pets" });
  } catch (err) {
    console.error(err);
    notify({ title: "Lỗi", text: "Thao tác thất bại!", type: "error" });
  } finally {
    state.busy = false;
  }
}

onBeforeMount(() => {
  if (route.params.id) {
    state.busy = true;
    api
      .getById(route.params.id)
      .then((data) => {
        state.pet = data;
        state.title = "Cập nhật quản lý loại thú cưng";
      })
      .catch((err) => {
        console.error(err);
        notify({ title: "Lỗi", text: "Không thể tải dữ liệu!", type: "error" });
      })
      .finally(() => {
        state.busy = false;
      });
  }
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
.is-invalid {
  border-color: #dc3545;
}
.invalid-feedback {
  color: #dc3545;
  font-size: 0.875em;
}
</style>