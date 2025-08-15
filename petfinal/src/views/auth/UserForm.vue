<template>
  <a href="/admin/User?s=&page=1" class="inline-text">Quản lý thông tin khách hàng</a><h3 class="inline-text">/Chỉnh sửa vai trò người dùng</h3>

  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="role" class="form-label">Vai trò:</label>
      <select class="form-control" id="role" v-model="form.role" required>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>
    </div>
    <div class="form-wrap">
      <button type="submit" class="btn btn-primary">Cập nhật</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const form = reactive({
  role: "customer",
});

async function onSubmit() {
  await userStore.updateUser(route.params.id, { role: form.role });
  router.push({ name: "admin-user" });
}

onMounted(async () => {
  const user = await userStore.fetchUserById(route.params.id);
  form.role = user.role;
});
</script>

<style scoped>
.form-wrap {
  max-width: 100px;
  margin: 20px 0; /* Canh chỉnh margin theo chiều dọc */
  border-radius: 5px;
  text-align: left; /* Đảm bảo căn chữ về đầu dòng */
}

.btn {
  display: block;
  width: 100%;
}

.inline-text {
  display: inline;
  color: rgb(37, 37, 37); /* Màu chữ giống thẻ h3 */
  font-size: 28px; /* Kích thước chữ giống thẻ h3 */
  font-weight: bold; /* Độ dày chữ giống thẻ h3 */
}
</style>
