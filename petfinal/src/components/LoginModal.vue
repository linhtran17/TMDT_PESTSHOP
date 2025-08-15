<template>
  <div class="modal-login">
    <ModalUpdateUser />
    <div class="user-info">
      <template v-if="auth.isAuthenticated">
        <div class="username">{{ auth?.user?.username || "anonymous" }}</div>
        <div class="user-option">
          <div v-if="auth.isAdmin" class="option" @click="() => router.push({ name: 'dashboard' })">
            Trang Admin
          </div>
          <div class="option" @click="goToProfile">Tài khoản của bạn</div>
          <!-- <div v-if="auth.isAdmin" class="option" @click="() => router.push({ name: 'my-order' })">
            Đơn hàng của tôi
          </div> -->
          <div class="option" @click="auth.logout()">Đăng xuất</div>
        </div>
      </template>
      <b-button
        v-else
        id="show-btn"
        class="btn btn-outline-light btn-login"
        @click="show($bvModal)"
      >
        Đăng nhập
      </b-button>
    </div>

    <b-modal id="bv-login" hide-footer hide-header size="lg">
      <template #default="{ close }">
        <div class="login-box">
          <div class="close" @click="close">×</div>
          <div class="mb-3 h2">
            <div class="mb-3 d-flex justify-content-center">
              <div class="h2">
                <b><i>Đăng nhập <span class="icon">PetStore</span></i></b>
              </div>
            </div>
          </div>
          <div>
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input
                type="email"
                class="form-control"
                id="email"
                placeholder="Enter Email"
                v-model="userProps.email"
                @keyup.enter="onLogin($bvModal)"
              />
              <div v-if="errorEmail" class="error">{{ errorEmail }}</div>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Enter Password"
                v-model="userProps.password"
                @keyup.enter="onLogin($bvModal)"
              />
              <div v-if="errorPassword" class="error">{{ errorPassword }}</div>
            </div>
            <div class="w-100">
              <button
                @click="onLogin($bvModal)"
                class="btn btn-outline-light pet-btn-primary w-100"
                :disabled="isLoading"
              >
                {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
              </button>
              <div class="w-100 d-flex justify-content-center align-items-center">
                <GoogleSignInButton
                  class="mt-3"
                  @success="(res) => handleLoginSuccess(res, $bvModal)"
                  @error="handleLoginError"
                ></GoogleSignInButton>
                <div>
                  <a href="#" @click="onForgotPassword" class="forgot-password">
                    <u><i>Quên mật khẩu ⍰⍰</i></u>
                  </a>
                </div>
              </div>
            </div>
            <div v-if="error && error.length" class="error">{{ error }}</div>
            <div class="sign-up">
              Nếu bạn chưa có tài khoản, hãy nhấn
              <span class="btn-signup" @click="onSignup($bvModal)">Đăng kí</span>
              ở đây nhé.
            </div>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { GoogleSignInButton } from "vue3-google-signin";
import api from "@/api/auth";
import ModalUpdateUser from "./UpdateUser.vue";

const router = useRouter();
const auth = useAuth();
const userProps = reactive({ email: "", password: "" });
const errorEmail = ref("");
const errorPassword = ref("");
const error = ref("");
const isMenuVisible = ref(false);
const isLoading = ref(false);

// Hàm kiểm tra định dạng email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const handleLoginSuccess = async (response, modal) => {
  const { credential } = response;
  if (credential) {
    try {
      const { user, token, updateUser } = await api.google({
        "access-token": credential,
      });
      auth.updateUser(user, token); // update local store
      modal.hide("bv-login");
      if (updateUser) {
        modal.show("bv-update-user");
      }
    } catch (error) {
      notify({
        text: "Đăng nhập không thành công vui lòng thử lại",
        type: "warn",
      });
    }
  } else {
    notify({
      text: "Đăng nhập không thành công vui lòng thử lại",
      type: "warn",
    });
  }
};

const handleLoginError = () => {
  console.error("Login failed");
};

const signInWithGoogle = async () => {
  try {
    await signIn();
    console.log("User signed in:", currentUser.value);
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

async function onLogin(modal) {
  // Reset lỗi trước khi kiểm tra
  errorEmail.value = "";
  errorPassword.value = "";
  error.value = "";

  // Kiểm tra giống backend (auth.ctrl.js)
  // 1. Kiểm tra email
  if (!userProps.email || userProps.email.length < 1 || userProps.email.length > 255) {
    errorEmail.value = "Email phải từ 1 đến 255 ký tự và không được để trống.";
    return;
  }
  if (!validateEmail(userProps.email)) {
    errorEmail.value = "Email không đúng định dạng.";
    return;
  }

  // 2. Kiểm tra password
  if (!userProps.password || userProps.password.length < 8 || userProps.password.length > 128) {
    errorPassword.value = "Mật khẩu phải từ 8 đến 128 ký tự và không được để trống.";
    return;
  }

  // Ngăn gửi nhiều yêu cầu
  if (isLoading.value) return;
  isLoading.value = true;

  try {
    await auth.login(userProps); // Đăng nhập người dùng
    notify({ type: "success", text: "Đăng nhập thành công!" });

    // Đóng modal sau khi đăng nhập thành công
    modal.hide("bv-login");

    // Điều hướng dựa trên vai trò người dùng
    const { user } = auth;
    if (user.role === "admin") {
      router.push({ path: "/admin" });
    } else {
      router.push({ path: "/" });
    }
  } catch (err) {
    error.value = err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin tài khoản.";
    notify({ type: "error", text: error.value });
  } finally {
    isLoading.value = false;
  }
}

function onSignup(modal) {
  router.push({ path: "/sign-up" });
  modal.hide("bv-login");
}

function goToProfile() {
  router.push({ path: "/profile" });
}

const show = (modal) => {
  modal.show("bv-login");
};

const hide = (modal) => {
  error.value = ""; // Xóa lỗi khi modal đóng
  userProps.email = "";
  userProps.password = "";
  modal.hide("bv-login");
};

function onForgotPassword() {
  router.push({ path: "/password" });
}
</script>

<style lang="scss">
.user-info {
  position: relative;
  display: inline-block;

  .btn-login {
    border: 1px solid #fff;
    background: transparent !important;
    color: #fff;
    padding: 0.5rem 2rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 1rem;

    &:hover {
      font-weight: bold;
      color: #fff !important;
    }
  }

  .username {
    border: 1px solid #fff;
    color: #fff;
    padding: 0.5rem 2rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 1rem;
    &:hover {
      font-weight: bold;
    }
  }

  .user-option {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 10px 0;
    min-width: 150px;
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s;
    z-index: 10;
    pointer-events: none;

    .option {
      padding: 10px 15px;
      color: #333;
      cursor: pointer;
      text-align: left;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }

  &:hover .user-option {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }
}
#bv-login .modal-dialog {
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
      .pet-btn-primary:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
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