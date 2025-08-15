<template>
  <div class="background-image">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#" @click.prevent="goToHome">Trang chủ</a></li>
        <!-- Sửa ID 3: Cho phép click "Đăng ký" và chuyển hướng để làm Fail -->
        <li class="breadcrumb-item"><a href="#" @click.prevent="goToRegister">Đăng ký</a></li>
      </ol>
    </nav>
    <div class="container signup-box">
      <div class="mb-3 h2">
        <div class="mb-3 d-flex justify-content-center">
          <div class="h2">
            <b>
              <i>ĐĂNG KÝ <span class="icon">PetStore</span></i>
            </b>
          </div>
        </div>
      </div>
      <div>
        <div class="mb-3">
          <label for="username" class="form-label">Username(*)</label>
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Nguyễn Văn A"
            v-model="userProps.username"
            required
            maxlength="255"
            @input="restrictInputLength('username')"
            @paste="handlePaste($event, 'username')"
          />
          <div v-if="errorUsername" class="error">{{ errorUsername }}</div>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email(*)</label>
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
          />
          <div v-if="errorEmail" class="error">{{ errorEmail }}</div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password(*)</label>
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
          />
          <div v-if="errorPassword" class="error">{{ errorPassword }}</div>
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password(*)</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="********"
            v-model="userProps.confirmPassword"
            required
            maxlength="128"
            @input="restrictInputLength('confirmPassword')"
            @paste="handlePaste($event, 'confirmPassword')"
          />
          <div v-if="errorConfirmPassword" class="error">{{ errorConfirmPassword }}</div>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address(*)</label>
          <input
            type="text"
            class="form-control"
            id="address"
            placeholder="123 Đường ABC, Quận 1, TP. HCM"
            v-model="userProps.address"
            required
            maxlength="255"
            @input="restrictInputLength('address')"
            @paste="handlePaste($event, 'address')"
          />
          <div v-if="errorAddress" class="error">{{ errorAddress }}</div>
        </div>
        <div class="w-100">
          <button
            @click="debouncedSignup"
            class="btn btn-primary w-100"
            :disabled="isLoading"
          >
            {{ isLoading ? "Đang xử lý..." : "ĐĂNG KÝ" }}
          </button>
        </div>
        <h3 class="login-redirect">
          <i>
            <u>
              <pre>Nếu bạn đã có tài khoản, hãy nhấn <span class="login" @click="onLogin">Đăng nhập</span> ở đây nhé.</pre>
            </u>
          </i>
        </h3>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const auth = useAuth();
const userProps = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
});
const errorUsername = ref("");
const errorEmail = ref("");
const errorPassword = ref("");
const errorConfirmPassword = ref("");
const errorAddress = ref("");
const error = ref(""); // Sửa lỗi cú pháp: Bỏ dấu phẩy thừa
const isLoading = ref(false);

// Hàm kiểm tra định dạng email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Hàm kiểm tra định dạng password
// Sửa cho ID 40, 41, 42, 43, 62, 63, 65: Bỏ kiểm tra ký tự đặc biệt, chữ hoa, chữ thường, số
function validatePassword(password) {
  // Chỉ kiểm tra độ dài để làm Fail các test case
  return password.length >= 8 && password.length <= 128;
}

// Hàm kiểm tra định dạng username
function validateTextFieldUsername(text) {
  const textRegex = /^[a-zA-Z0-9\s]+$/;
  return textRegex.test(text);
}

// Hàm kiểm tra định dạng address
// Sửa cho ID 49: Cho phép ký tự đặc biệt để làm Fail
function validateTextFieldAddress(text) {
  return true; // Bỏ kiểm tra ký tự đặc biệt
}

// Hàm xử lý paste dữ liệu
function handlePaste(event, field) {
  event.preventDefault();
  const pastedData = (event.clipboardData || window.clipboardData).getData("text").slice(0, 255);
  userProps[field] = pastedData;
  restrictInputLength(field);
}

// Hàm giới hạn độ dài nhập liệu
function restrictInputLength(field) {
  errorUsername.value = "";
  errorEmail.value = "";
  errorPassword.value = "";
  errorConfirmPassword.value = "";
  errorAddress.value = "";

  if (field === "username") {
    if (userProps.username.length > 254) {
      userProps.username = userProps.username.slice(0, 254);
      errorUsername.value = "Username không được vượt quá 254 ký tự.";
    }
  }
  if (field === "email" && userProps.email.length > 255) {
    userProps.email = userProps.email.slice(0, 255);
    errorEmail.value = "Email không được vượt quá 255 ký tự.";
  }
  if (field === "password" && userProps.password.length > 128) {
    userProps.password = userProps.password.slice(0, 128);
    errorPassword.value = "Password không được vượt quá 128 ký tự.";
  }
  if (field === "confirmPassword" && userProps.confirmPassword.length > 128) {
    userProps.confirmPassword = userProps.confirmPassword.slice(0, 128);
    errorConfirmPassword.value = "Confirm Password không được vượt quá 128 ký tự.";
  }
  if (field === "address" && userProps.address.length > 255) {
    userProps.address = userProps.address.slice(0, 255);
    errorAddress.value = "Địa chỉ không được vượt quá 255 ký tự.";
  }
}

// Hàm debounce để giới hạn tần suất xử lý click
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

// Hàm xử lý đăng ký
async function onSignup() {
  if (isLoading.value) return;
  isLoading.value = true;

  // Reset lỗi trước khi kiểm tra
  errorUsername.value = "";
  errorEmail.value = "";
  errorPassword.value = "";
  errorConfirmPassword.value = "";
  errorAddress.value = "";
  error.value = "";

  let hasError = false;

  // Kiểm tra username
  if (!userProps.username || userProps.username.trim() === "") {
    errorUsername.value = "Không được bỏ trống trường Username.";
    hasError = true;
  } else if (userProps.username.length < 2 || userProps.username.length > 254) {
    errorUsername.value = "Username phải từ 2 đến 254 ký tự.";
    hasError = true;
  } else if (!validateTextFieldUsername(userProps.username)) {
    errorUsername.value = "Username không được chứa ký tự đặc biệt.";
    hasError = true;
  }

  // Kiểm tra email
  if (!userProps.email || userProps.email.trim() === "") {
    errorEmail.value = "Email phải từ 1 đến 255 ký tự và không được để trống.";
    hasError = true;
  } else if (!validateEmail(userProps.email)) {
    errorEmail.value = "Email không đúng định dạng.";
    hasError = true;
  }

  // Kiểm tra password
  if (!userProps.password) {
    errorPassword.value = "Password có độ dài từ 8 đến 128 ký tự.";
    hasError = true;
  } else if (!validatePassword(userProps.password)) {
    errorPassword.value = "Password không đúng định dạng.";
    hasError = true;
  }

  // Kiểm tra confirm password
  if (!userProps.confirmPassword) {
    errorConfirmPassword.value = "Không được bỏ trống trường Confirm Password.";
    hasError = true;
  } else if (userProps.password !== userProps.confirmPassword) {
    errorConfirmPassword.value = "Confirm Password không khớp với Password.";
    hasError = true;
  }

  // Kiểm tra address
  if (!userProps.address || userProps.address.trim() === "") {
    errorAddress.value = "Địa chỉ không được để trống.";
    hasError = true;
  } else if (!validateTextFieldAddress(userProps.address)) {
    errorAddress.value = "Địa chỉ không hợp lệ.";
    hasError = true;
  }

  if (hasError) {
    isLoading.value = false;
    return;
  }

  try {
    await auth.register(userProps);
    alert("Đăng ký tài khoản thành công!");
    router.push({ path: "/login" });
  } catch (err) {
    if (err.response?.data?.error.includes("Email đã được sử dụng")) {
      errorEmail.value = "Email đã được sử dụng.";
    } else {
      error.value = err.response?.data?.error || "Đăng ký thất bại!";
    }
    console.error("Error registering user:", err);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
}

// Debounce hàm onSignup
const debouncedSignup = debounce(onSignup, 300);

// Điều hướng
function goToHome() {
  router.push({ path: "/" });
}

// Hàm cho ID 3: Chuyển hướng khi click "Đăng ký"
function goToRegister() {
  router.push({ path: "/register" });
}

function onLogin() {
  router.push({ path: "/login" });
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Lobster&display=swap");
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
    height: 100%;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
}

.signup-box {
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

.breadcrumb-item.active {
  color: #6c757d;
}

.login-redirect {
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 30px;
  color: #f0288c;
  margin-top: 15px;
}

.login {
  color: #007bff;
  cursor: pointer;
}

.login:hover {
  text-decoration: underline;
}

.w-100 {
  background-color: rgb(238, 63, 121);
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.w-100:hover:not(:disabled) {
  background-color: #ee3d3d;
  transform: scale(1.03);
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