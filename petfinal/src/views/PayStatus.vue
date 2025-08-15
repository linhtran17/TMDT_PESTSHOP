<template>
  <div
    class="container pay d-flex flex-column justify-content-center align-items-center w-100 text-center"
  >
    <div v-if="route.query?.code === '00'" class="success-message">
      <img src="/src/assets/icons/checked.png" alt="Thanh toán thành công" class="success-icon" />
      <h2 class="message-text">Giao dịch thành công!</h2>
    </div>
    <div v-else class="error-message">
        <img src="/src/assets/icons/remove.png" alt="Thanh toán thất bại" class="error-icon" />
        <h2 class="message-text">Giao dịch thất bại!</h2>
    </div>
    <b-link href="/" class="return-home">Quay lại trang chủ</b-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style lang="scss">
.pay {
  min-height: 300px;
  padding: 100px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .success-message,
  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .success-icon {
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
    }
    .error-icon {
    width: 80px; 
    height: 80px;
    margin-bottom: 20px;
  }

    .message-text {
      font-family: "Poppins", sans-serif;
      font-size: 1.8rem;
      font-weight: 600;
      color: #28a745; 
    }
  }

  .error-message .message-text {
    color: #dc3545; 
    
  }

  .return-home {
    display: inline-block;
    margin-top: 20px;
    font-size: 1.2rem;
    color: #007bff;
    text-decoration: none;
    padding: 10px 20px;
    border: 2px solid #007bff;
    border-radius: 5px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #007bff;
      color: white;
    }
  }
}
</style>
