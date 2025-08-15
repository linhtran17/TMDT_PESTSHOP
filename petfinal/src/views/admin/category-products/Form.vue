<template>
  <div class="main-wrap">
    <div class="mb-3 h2">
      <div class="mb-3 d-flex justify-content-start">
        <router-link to="/admin/cat-pro" class="h3">Quản lý thương hiệu</router-link>
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
          v-model="state.product.name"
          required
        />
      </div>
      <div>
        <label for="cat_pet" class="form-label">Thú cưng:</label>
        <select 
          class="form-select" 
          name="cat_pet" 
          required 
          aria-label="Category product" 
          v-model="state.product.cat_pet"
        >
          <option value="" disabled>Chọn thú cưng</option>
          <option
            v-for="cat in state.categories"
            :key="`cat-${cat.id}`"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="mt-3">
        <div @click="onSave" class="btn btn-primary w-100">Lưu</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import api from "@/api/cat-product";
import catApi from "@/api/cat-pet";
import { useRoute, useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import MyLoading from "@/components/Loading.vue";

const route = useRoute();
const router = useRouter();

const state = reactive({
  busy: false,
  title: "Thêm mới",
  product: {
    id: null,
    name: "",
    cat_pet: ""
  },
  categories: [],
});

async function onSave() {
  // Kiểm tra tên trống
  if (!state.product.name) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Tên loại không được để trống!",
    });
    return;
  }

  // Kiểm tra độ dài tên
  if (state.product.name.length > 255) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Tên sản phẩm không được quá 255 ký tự!",
    });
    return;
  }

  // Kiểm tra ký tự đặc biệt
  if (/[!@#$%^&*(),.?":{}|<>]/.test(state.product.name)) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Tên không được chứa ký tự đặc biệt!",
    });
    return;
  }

  // Kiểm tra thú cưng
  if (!state.product.cat_pet) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Vui lòng chọn thú cưng!",
    });
    return;
  }

  state.busy = true;
  try {
    if (route.params.id) {
      await api.update(route.params.id, state.product);
    } else {
      await api.add(state.product);
    }
    notify({ title: "Thông tin", text: "Thao tác thành công!" });
    router.push({ name: "cat-pro" });
  } catch (error) {
    notify({
      type: "error",
      title: "Thông tin",
      text: "Có lỗi xảy ra khi lưu!",
    });
  } finally {
    state.busy = false;
  }
}

onBeforeMount(() => {
  const fetchData = async () => {
    state.busy = true;
    try {
      if (route.params.id) {
        const data = await api.getById(route.params.id);
        state.title = "Cập nhật sự kiện quản lý thương hiệu";
        state.product = { ...data, cat_pet: data.cat_pet || "" };
      }

      const result = await catApi.find("limit=100");
      if (result.list) {
        state.categories = result.list;
      }
    } catch (error) {
      notify({
        type: "error",
        title: "Thông tin",
        text: "Không thể tải dữ liệu!",
      });
    } finally {
      state.busy = false;
    }
  };
  fetchData();
});
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
}
</style>