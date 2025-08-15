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
                <div class="option" @click="goToPurchases" style="background-color: black;border: 5px solid red; color: beige;">
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
                <div class="option" @click="goToReviews">
                  <i class="fas fa-lock me-2"></i> Đánh giá
                </div>
              </div>
            </div>
          </div>
  
          <!-- Profile Content -->
          <div class="col-md-9">
            <div class="orders-section">
              <div class="orders-header">
                <div class="h3" style="padding-left: 17px; padding-top: 10px;">{{ route.meta.title || "Đơn hàng của bạn" }}</div>
                <p class="note" style="padding-left: 17px;">(*)Nhấn vào thông tin đơn hàng để biết thêm chi tiết.</p>
                <!-- <div class="tabs" style="padding-left: 50px;">
                  <button class="tab active" @click="filterOrders('all')">Tất cả</button>
                  <button class="tab" @click="filterOrders('created')">Đang xác nhận</button>
                  <button class="tab" @click="filterOrders('pending')">Đang xử lý</button>
                  <button class="tab" @click="filterOrders('delivered')">Đã giao hàng</button>
                  <button class="tab" @click="filterOrders('cancelled')">Đã hủy</button>
                  <br>
                </div> -->
                <!-- <br> -->
              </div>
  
              <div class="orders-list">
                <div class="main-wrap" >
                  <div class="w-100">
                    <Orders :getData="orderApi.find" title="Danh sách đơn hàng"/>
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
  import { reactive, onMounted, computed } from "vue";
  import { useAuth } from "@/stores/auth";
  import { useRoute, useRouter } from "vue-router";
  import orderApi from '@/api/orders';
  import Orders from "@/views/admin/dashboard/Orders-shipper.vue";
  
  const router = useRouter();
  const route = useRoute();
  const storeAuth = useAuth();
  const state = reactive({
    avatarPreview: null,
    defaultAvatar: "https://media.assettype.com/analyticsinsight%2F2024-11-28%2Frzfeyqc9%2FViral-Meme-Chill-Guy-Inspires-New-Cryptocurrency-Surge.jpg?w=768&auto=format%2Ccompress&fit=max",
    orders: [],
    filter: 'all'
  });
  const user = storeAuth.user || {};
  
  const fetchOrders = async () => {
    try {
      const response = await orderApi.find();
      state.orders = response.data; // Giả sử response.data chứa danh sách đơn hàng từ API
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };
  
  const filteredOrders = computed(() => {
    let filtered = state.orders;
    if (state.filter !== 'all') {
      filtered = filtered.filter(order => order.status === state.filter);
    }
    return filtered;
  });
  
  const filterOrders = (status) => {
    state.filter = status;
  };
  
  onMounted(() => {
    fetchOrders(); // Lấy thông tin đơn hàng khi component được tạo
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
  /* Profile Container */
  .profile-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f7f9fc;
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
  }
  
  /* Orders Section */
  .orders-section {
    background-color: #fff;
    // padding: 20px;
    border-radius: 7px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    left: 20px;
  
  }
  
  .orders-header {
    background: linear-gradient(to right, #ff7e5f, #feb47b);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
    border-radius: 7px 7px 0 0;
  
  }
  
  .tabs {
    display: flex;
    gap: 10px;
  }
  
  .tab {
    padding: 10px 15px;
    border: none;
    background-color: #eaeaea;
    border-radius: 5px;
    cursor: pointer;
    font-weight:bolder;
    font-size:x-large;
  }
  
  .tab.active {
    background-color: #000;
    color: #fff;
  }
  
  .orders-list .order-item {
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  </style>