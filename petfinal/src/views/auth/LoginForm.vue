<template>
  <div class="background-image">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#" @click.prevent="goToHome">Trang chủ</a></li>
        <li class="breadcrumb-item"><a href="#" @click.prevent="goToLogin">Đăng nhập</a></li>
      </ol>
    </nav>
    <div class="container login-box">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-center">
          <div class="h2">
            <b>
              <i>ĐĂNG NHẬP <span class="icon">PetStore</span></i>
            </b>
          </div>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <label for="email" class="form-label">Email(*):</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="user123@example.com"
            v-model="userProps.email"
            required
            maxlength="255"
            @input="restrictInputLength('email')"
            @paste="handlePaste($event, 'email')"
            @keyup.enter="debouncedLogin"
          />
          <div v-if="errorEmail" class="error">{{ errorEmail }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password(*):</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="********"
            v-model="userProps.password"
            required
            maxlength="128"
            @input="restrictInputLength('password')"
            @paste="handlePaste($event, 'password')"
            @keyup.enter="debouncedLogin"
          />
          <div v-if="errorPassword" class="error">{{ errorPassword }}</div>
        </div>
        <div class="w-100">
          <button
            @click="debouncedLogin"
            class="btn btn-primary w-100"
            :disabled="isLoading"
          >
            {{ isLoading ? "Đang xử lý..." : "ĐĂNG NHẬP" }}
          </button>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <h3 class="sign-up">
          <u>
            <i>
              <pre>Nếu bạn chưa có tài khoản, hãy nhấn <span class="signup" @click="onSignup">Đăng ký</span> ở đây nhé.</pre>
            </i>
          </u>
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const auth = useAuth();
const userProps = reactive({ email: "", password: "" });
const errorEmail = ref("");
const errorPassword = ref("");
const error = ref("");
const isLoading = ref(false);

// Hàm kiểm tra định dạng email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Hàm kiểm tra định dạng password
function validatePassword(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return (
    password.length >= 8 &&
    password.length <= 128 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}

// Hàm xử lý dán dữ liệu
function handlePaste(event, field) {
  event.preventDefault();
  const pastedData = (event.clipboardData || window.clipboardData)
    .getData("text")
    .slice(0, field === "email" ? 255 : 128);
  userProps[field] = pastedData;
  restrictInputLength(field);
}

// Hàm giới hạn độ dài nhập liệu
function restrictInputLength(field) {
  errorEmail.value = "";
  errorPassword.value = "";

  if (field === "email" && userProps.email.length > 255) {
    userProps.email = userProps.email.slice(0, 255);
    errorEmail.value = "Email phải từ 1 đến 255 ký tự và không được để trống.";
  }
  if (field === "password" && userProps.password.length > 128) {
    userProps.password = userProps.password.slice(0, 128);
    errorPassword.value = "Mật khẩu phải từ 8 đến 128 ký tự và không được để trống.";
  }
}

// Hàm debounce để giới hạn tần suất click
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Hàm xử lý đăng nhập
async function onLogin() {
  if (isLoading.value) return;
  isLoading.value = true;

  // Reset lỗi trước khi kiểm tra
  errorEmail.value = "";
  errorPassword.value = "";
  error.value = "";

  // Kiểm tra email
  if (!userProps.email || userProps.email.trim() === "") {
    errorEmail.value = "Email phải từ 1 đến 255 ký tự và không được để trống.";
    isLoading.value = false;
    return;
  }
  if (!validateEmail(userProps.email)) {
    errorEmail.value = "Email không đúng định dạng.";
    isLoading.value = false;
    return;
  }

  // Kiểm tra password
  if (!userProps.password || userProps.password.trim() === "") {
    errorPassword.value = "Mật khẩu phải từ 8 đến 128 ký tự và không được để trống.";
    isLoading.value = false;
    return;
  }
  if (!validatePassword(userProps.password)) {
    errorPassword.value = "Mật khẩu không đúng định dạng.";
    isLoading.value = false;
    return;
  }

  try {
    await auth.login({ email: userProps.email, password: userProps.password });
    notify({ type: "success", text: "Đăng nhập thành công!" });
    const { user } = auth;
    if (user.role === "admin") {
      router.push({ path: "/admin" });
    } else {
      router.push({ path: "/" });
    }
  } catch (err) {
    error.value =
      err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin tài khoản.";
    notify({ type: "error", text: error.value });
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
}

// Debounce hàm onLogin
const debouncedLogin = debounce(onLogin, 300);

// Điều hướng
function goToHome() {
  router.push({ path: "/" });
}

function goToLogin() {
  // Không làm gì, giữ nguyên màn hình đăng nhập
}

function onSignup() {
  router.push({ path: "/sign-up" });
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");
main {
  max-width: none !important;
}
.container {
  width: 90%;
}
@media (max-width: 2000px) {
  .background-image {
    background-image: url("@/assets/img/background-login-sign.png");
    padding-top: 20px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100vh;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}
.login-box {
  background: rgba(255, 255, 255, 0.8);
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 100%;
}
.breadcrumb {
  background: transparent;
  padding: 10px 15px;
}
.breadcrumb-item a {
  color: #007bff;
  text-decoration: none;
}
.breadcrumb-item a:hover {
  text-decoration: underline;
}
.sign-up {
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 30px;
  color: #f0288c;
  margin-top: 15px;
}
.signup {
  color: #007bff;
  cursor: pointer;
}
.signup:hover {
  text-decoration: underline;
}
.w-100 {
  background-color: rgb(238, 63, 121);
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
}
.w-100:hover:not(:disabled) {
  background-color: #ee3d3d;
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
.w-100:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.h2 {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-size: 50px;
}
.icon {
  color: #f350a1;
  font-family: "Lobster", cursive;
  font-size: 60px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>