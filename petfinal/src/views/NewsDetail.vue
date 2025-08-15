<template>
  <div v-if="state.news" class="news-detail">
    <h1 class="title">{{ state.news.tieude }}</h1>
    <img :src="state.news.hinhanh" alt="Hình ảnh bài viết" class="image" />
    <p class="content">{{ state.news.noidung }}</p>
    <p class="content">{{ state.news.description }}</p>
  </div>
  <div v-else class="loading">
    <p>Đang tải chi tiết bài viết...</p>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import newApi from '@/api/news';

const route = useRoute();
const state = reactive({ news: null });

function fetchNewsDetail() {
  const id = route.params.id; // Lấy ID từ URL
  if (id) {
    newApi
      .getById(id) // Gọi API với ID
      .then((data) => {
        state.news = data || null;
      })
      .catch((err) => console.error(err));
  }
}

onMounted(() => {
  fetchNewsDetail(); // Gọi hàm khi component được mount
});

</script>

<style  lang="scss" scoped>
.news-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .image {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }

  .content {
    font-size: 16px;
    line-height: 1.6;
  }
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}
</style>
