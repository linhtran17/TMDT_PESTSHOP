<template>
    <div class="profile-container">
      <div class="container mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="sidebar p-3">
              <div class="text-center mb-4">
                <img
                  :src="user?.savedAvatar || state.avatarPreview || state.defaultAvatar"
                  alt="User Avatar"
                  class="rounded-circle img-thumbnail"
                />
              </div>
              <div class="user-option">
                <div class="option" @click="goToProfile">
                  <i class="fas fa-user me-2"></i> Hồ Sơ
                </div>
                <div class="option" @click="goToPurchases">
                  <i class="fas fa-university me-2"></i> Đơn hàng của bạn
                </div>
                <div class="option" @click="goToAddress">
                  <i class="fas fa-map-marker-alt me-2"></i> Địa Chỉ
                </div>
                <div class="option" @click="goToPasswordChange">
                  <i class="fas fa-key me-2"></i> Đổi Mật Khẩu
                </div>
                <div class="option" @click="goToNotifications">
                  <i class="fas fa-bell me-2"></i> Thông Báo
                </div>
                <div class="option" @click="goToVouchers">
                  <i class="fas fa-wallet me-2"></i> Kho Voucher
                </div>
                <div class="option" @click="goToReviews" style="background-color: black; color: beige; border: 5px solid red;">
                  <i class="fas fa-lock me-2"></i> Đánh giá
                </div>
              </div>
            </div>
          </div>
  
          <!-- Review Container -->
          <div class="col-md-9">
            <div class="review-container p-4">
              <h5>Đánh giá Trang Petstore</h5>
              <form @submit.prevent="submitReview">
                <div class="mb-3">
                  <label for="reviewText" class="form-label">Mời bạn chia sẻ thêm một số cảm nhận:</label>
                  <textarea v-model="state.reviewText" id="reviewText" class="form-control" rows="4" required></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Gửi ảnh thực tế:</label>
                  <input type="file" @change="onFileChange" class="form-control" accept="image/*">
                </div>
                <div class="mb-3">
                  <label class="form-label">Bạn cảm thấy thế nào về sản phẩm? (Chọn sao)</label>
                  <img src="https://png.pngtree.com/png-vector/20220703/ourmid/pngtree-5-star-review-five-vector-png-image_5560551.png" alt="">
                  <!-- <div class="star-rating">
                    <img v-for="star in 5" :key="star" :src="starIcon" :class="{ 'checked': state.rating >= star }" @click="setRating(star)" class="star-icon"/>
                  </div> -->
                </div>
                <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { reactive } from "vue";
  import { useAuth } from "@/stores/auth";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const storeAuth = useAuth();
  
  const state = reactive({
    avatarPreview: null,
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
    reviewText: "",
    rating: 0,
    reviewImage: null,
    starIcon: "https://e7.pngegg.com/pngimages/534/792/png-clipart-yellow-star-star-5-star-angle-triangle-thumbnail.png" // Biểu tượng sao
  });
  
  const user = storeAuth.user || {};
  
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        state.reviewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const setRating = (star) => {
    state.rating = star;
  };
  
  const submitReview = () => {
    // Xử lý logic gửi đánh giá ở đây
    alert("Đánh giá của bạn đã được gửi!");
  };
  
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
    background-color: #f7f9fc;
  }
  
  .container {
    flex: 1;
  }
  
  .sidebar {
    background-color: #f5ed84;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    margin-bottom: 20px;
  }
  
  .review-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
  }
  
  .star-rating {
    display: flex;
    gap: 10px;
  }
  
  .star-icon {
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  
  .star-icon.checked {
    filter: brightness(1.5);
  }
  
  .form-control {
    margin-top: 10px;
    padding: 10px;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  </style>