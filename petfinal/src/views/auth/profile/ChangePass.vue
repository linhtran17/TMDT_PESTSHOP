<template>
    <div class="profile-container">
      <div class="container mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="sidebar p-3">
              <div class="text-center mb-4">
                <img :src="user?.savedAvatar || state.avatarPreview || state.defaultAvatar" alt="User Avatar" class="rounded-circle img-thumbnail" />
              </div>
              <div class="user-option">
                <div class="option" @click="goToProfile"><i class="fas fa-user me-2"></i> Hồ Sơ</div>
                <div class="option" @click="goToPurchases"><i class="fas fa-university me-2"></i> Đơn hàng của bạn</div>
                <div class="option" @click="goToAddress"><i class="fas fa-map-marker-alt me-2"></i> Địa Chỉ</div>
                <div class="option" @click="goToPasswordChange" style="background-color: black; color: beige; border: 5px solid red;"><i class="fas fa-key me-2"></i> Đổi Mật Khẩu</div>
                <div class="option" @click="goToNotifications"><i class="fas fa-bell me-2"></i> Thông Báo</div>
                <div class="option" @click="goToVouchers"><i class="fas fa-wallet me-2"></i> Kho Voucher</div>
                <div class="option" @click="goToReviews"><i class="fas fa-lock me-2"></i> Đánh giá</div>
              </div>
            </div>
          </div>
  
          <!-- Main Content -->
          <div class="col-md-9">
            <div class="forgot-password-container p-4">
              <div class="card p-4">
                <div class="card-header text-center">
                  <img src="https://cdn2.iconfinder.com/data/icons/privacy-policy/512/privacy-data-policy-security-19-64.png" alt="Security Icon" class="mb-3" />
                  <h4>Quên mật khẩu</h4>
                  <p>Để tăng cường bảo mật cho tài khoản của bạn, hãy xác minh thông tin bằng một trong những cách sau.</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="sendResetLink">
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input type="email" v-model="state.email" class="form-control" id="email" readonly>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-3">Gửi yêu cầu</button>
                  </form>
                  <div v-if="state.showConfirmation" class="alert alert-success mt-3">
                    Đã gửi mã về email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { reactive, onMounted } from "vue";
  import { notify } from "@kyvg/vue3-notification";
  import { useAuth } from "@/stores/auth";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const storeAuth = useAuth();
  
  const state = reactive({
    avatarPreview: null,
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
    email: "",
    showConfirmation: false
  });
  
  const user = storeAuth.user || {};
  
  const sendResetLink = () => {
    state.showConfirmation = true;
    notify({
      type: 'success',
      title: 'Thành công',
      text: 'Đã gửi email khôi phục mật khẩu!',
    });
  };
  
  onMounted(() => {
    state.email = user.email || "";
  });
  
  // Điều hướng các chức năng sidebar
  const goToProfile = () => router.push({ name: "profile" });
  const goToPurchases = () => router.push({ name: "purchases" });
  const goToAddress = () => router.push({ name: "address" });
  const goToPasswordChange = () => router.push({ name: "changePass" });
  const goToNotifications = () => router.push({ name: "notification" });
  const goToVouchers = () => router.push({ name: "vouchers" });
  const goToReviews = () => router.push({ name: "Danhgia" });
  </script>
  <style scoped lang="scss">
  .profile-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f7f9fc; /* Màu nền tổng thể */
  }
  
  .sidebar {
    background-color: #f5ed84;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng cho sidebar */
  }
  
  .user-option {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .option {
    border: none;
    padding: 1rem;
    margin: 0 8px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 5px;
    background-color: #ffffff;
  }
  
  .option:hover {
    background-color: #000000;
    color: #ffffff;
  }
  
  .rounded-circle {
    width: 200px;
    height: 200px;
  }
  .rounded-circle {
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
  }
  
  .forgot-password-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
  }
  
  .card {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    color: #ffffff;
    padding: 1rem;
    border-radius: 10px 10px 0 0;
  }
  
  .card-header img {
    width: 64px; /* Kích thước biểu tượng */
  }
  
  .card-body {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  
  .alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }
  </style>