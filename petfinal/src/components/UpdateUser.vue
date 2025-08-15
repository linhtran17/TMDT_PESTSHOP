<template>
  <b-modal id="bv-update-user" hide-footer hide-header size="lg">
    <template #default="{ close }">
      <div class="login-box">
        <div class="close" @click="close">&times;</div>
        <div class="mb-3 h2">
          <div class="mb-3 d-flex justify-content-center">
            <div class="h2">Cập nhật thông tin</div>
          </div>
        </div>
        <div>
          <div>
            <label for="name" class="form-label">Tài khoản</label>
            <input
              type="text"
              class="form-control"
              id="name"
              placeholder="Nhập tên tài khoản"
              v-model="state.username"
            />
          </div>
          <div class="mt-3">
            <label for="phone" class="form-label">Số điện thoại:</label>
            <input
              type="phone"
              class="form-control"
              id="phone"
              placeholder="Nhập số điện thoại"
              v-model="state.phone"
            />
          </div>
          <div class="mt-3">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              class="form-control"
              id="email"
              readonly
              placeholder="Nhập số điện thoại nhận hàng"
              v-model="state.email"
            />
          </div>
          <div class="mt-3">
            <label for="address" class="form-label">Địa chỉ:</label>
            <input
              type="address"
              class="form-control"
              id="address"
              placeholder="Nhập địa chỉ"
              v-model="state.address"
            />
          </div>
          <div class="w-100 mt-3">
            <button
              :disabled="appState.busy"
              @click="onSubmit($bvModal)"
              class="btn btn-outline-light pet-btn-primary w-100"
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </template>
  </b-modal>
</template>
  
  <script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import api from "@/api/auth";
import { Axios, AxiosError } from "axios";

const router = useRouter();
const auth = useAuth();

const appState = reactive({ busy: false });

const state = reactive({
  email: auth.user?.email,
  username: "",
  phone: "",
  address: "",
});

const onSubmit = async (modal) => {
  try {
    appState.busy = true;
    const { user, token } = await api.update(state);
    if (user && token) auth.updateUser(user, token);
    notify({ text: "Update successfully!", type: "success" });
    modal.hide("bv-update-user");
  } catch (error) {
    let message = error;
    if (error instanceof AxiosError) {
      message = error?.response?.data?.error || "Error!";
    }
    notify({
      text: message,
      type: "error",
    });
  } finally {
    appState.busy = false;
  }
};

watch(auth.user, (newVal, oldVal) => {
  console.log("watch state", newVal, oldVal);
});

onMounted(() => {
  state.email = auth?.user?.email || "";
});
</script>
  
<style lang="scss">
#bv-update-user .modal-dialog {
  .modal-content {
    background: #fff;
    padding: 0;
    margin: 0;
    position: relative;
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
      font-size: 1.5rem;
    }
    .login-box {
      padding: 50px;
      .pet-btn-primary {
        border-radius: 40px;
        background-color: rgb(243, 5, 96);
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.4s ease;
        width: 100%;
        color: #fff;
      }
      .sign-up {
        text-align: center;
        font-family: "Satisfy", cursive;
        font-size: 17px;
        color: #f0288c;
        margin-top: 15px;
        .btn-signup {
          color: #007bff;
          cursor: pointer;
        }
      }
      .error {
        color: red;
        margin-top: 1rem;
      }
      .icon {
        color: #f350a1;
        font-family: "Lobster", cursive;
        font-size: 60px;
      }
    }
  }
}
</style>
  