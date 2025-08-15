<template>
  <main>
    <div class="sp_hot">
      <h2 class="sp_hot_title">Tin tức mới</h2>
    </div>

    <div class="box" v-for="item in newsList" :key="item.id" @click="goToDetailPage(item.id)">
  <div class="box-image">
    <div class="image-cover">
      <img
    
  width="600"
  height="400"
  :src="item.image"
  :alt="item.title"
  decoding="async"
  sizes="(max-width: 600px) 100vw, 600px"
/>

    </div>
  </div>
  <div class="box-text">
    <div class="box-text-inner">
      <h5 class="post-title">{{ item.title }}</h5>
      <div class="is-divider"></div>
      <p class="from_the_blog_excerpt">{{ item.excerpt }}</p>
    </div>
  </div>
</div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      newsList: [
  {
    id: 1,
    title: 'Cách chăm sóc thú cưng trong mùa đông ? | Pet Store',
    excerpt: '1. Mùa đông đến, việc chăm sóc thú cưng cần được đặc biệt chú ý...',
    image: '/images/cham_soc_thu_cung_dong.jpg', // Đường dẫn từ public/images
  },
  {
    id: 2,
    title: 'Những món ăn tốt nhất cho chó? | Pet-Store',
    excerpt: '1. Có rất nhiều loại thực phẩm tốt cho sức khỏe của chó...',
    image: '/images/dog_food.jpg',
  },
  {
    id: 3,
    title: 'Giải pháp cho mèo không chịu ăn? | Pet-Store',
    excerpt: '1. Nếu mèo của bạn không chịu ăn, hãy thử một số giải pháp hữu ích dưới đây để...',
    image: '/images/cat_eating.jpg',
  },
  {
    id: 4,
    title: 'Những bệnh thường gặp ở mèo | Pet-Store',
    excerpt: '1. Mèo cũng có thể mắc nhiều bệnh. Bài viết này sẽ giúp bạn nhận biết ...',
    image: '/images/cat_diseases.webp',
  },
]

    };
  },
  methods: {
    goToDetailPage(postId) {
      this.$router.push({ name: 'news-detail', params: { id: postId } });
    },
  },
};
</script>



  
  <style scoped>
/* Tiêu đề phần tin tức mới */
.sp_hot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  background-color: #e94560;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #fff;
  text-transform: uppercase;
}

.sp_hot_title {
  margin-bottom: 0;
}

/* Thiết lập layout cho các item theo hàng ngang */
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  margin: 0 auto;
}

/* Thiết kế cho các thẻ tin tức */
.box {
  flex: 1 1 calc(25% - 1rem); /* Mỗi item chiếm 1/4 không gian */
  max-width: calc(25% - 1rem);
  background-color: #fff;
  border: 1px solid #cdcdcd;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover effect */
.box:hover {
  transform: translateY(-5px); /* Di chuyển nhẹ lên trên khi hover */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3); /* Tăng bóng đổ */
}

/* Thiết kế cho phần hình ảnh */
.box-image {
  width: 100%;
  padding-top: 56.25%; /* Tỷ lệ 16:9 cho hình ảnh */
  position: relative;
}

.image-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem 0.5rem 0 0;
}

/* Thiết kế cho phần văn bản */
.box-text {
  padding: 1rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.is-divider {
  width: 100%;
  height: 2px;
  background-color: #e94560;
  margin: 0.5rem 0;
}

.from_the_blog_excerpt {
  font-size: 0.9rem;
  color: #666;
}
</style>
  