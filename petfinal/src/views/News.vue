<template>
  <div class="container">
    <div class="col-md-9">
      <div
        class="new_item"
        v-for="item in state.news"
        :key="`new-${item.id}`"
        @click="goToDetail(item.id)"
      >
        <img :src="item?.hinhanh" :alt="item?.hinhanh || ''" class="img" />
        <div class="content">
          <h4 class="item-tieude">{{ item.tieude }} | Pet-Store</h4>
          <p class="item-noidung">{{ item.noidung }}</p>
        </div>
      </div>
    </div>

    <!-- Phần bài viết mới -->
    <div class="col-md-3 aside-right">
      <div class="input-group mb-3 btn-search">
        <input
          type="search"
          class="form-control border-danger"
          placeholder="Search..."
          aria-describedby="button-addon2"
        />
        <button class="btn btn-outline-danger" type="button" id="button-addon2">
          Tìm kiếm
        </button>
      </div>

      <div class="title">
        <h4>Bài viết mới</h4>
      </div>

      <div class="content">
  <div 
    class="new_item" 
    v-for="item in state.news.slice(0, 5)" 
    :key="`recent-new-${item.id}`" 
    @click="goToDetail(item.id)">
    <h6 class="item-tieude text">{{ item.tieude }}</h6>
  </div>
</div>
    </div>
  </div>
</template>


<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import newApi from "@/api/news";
import NewsDetail from "./NewsDetail.vue";



const router = useRouter();
const state = reactive({ news: [], busy: true });

function fetchNews() {
  state.busy = true;
  newApi
    .news() // Gọi đúng phương thức `news` từ đối tượng `newApi`
    .then((data) => {
      state.news = data.list || []; // Đảm bảo sử dụng đúng cấu trúc trả về
    })
    .catch((err) => console.error(err))
    .finally(() => {
      state.busy = false;
    });
}


function goToDetail(id) {
  if (id) {
    router.push({ name: "news-detail", params: { id } });
  }
}


onMounted(fetchNews);
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  margin: 15px auto;
  max-width: 1200px;
  font-family: Arial, sans-serif;
}

.new_item {
  display: flex;
  align-items: flex-start;
  background-color: #fff;
  padding: 20px;
  gap: 20px;

  img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    flex-shrink: 0;
    border-radius: 0.5rem;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    flex-grow: 1;
    font-size: medium;
    max-height: 100px;
    overflow: hidden;

    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    h4 {
      text-align: left;
    }
  }
}

.aside-right {
  .btn-search {
    input {
      color: #e94560;

      &::placeholder {
        color: #e94560;
      }

      &:focus {
        box-shadow: none;
      }
    }
  }

  .title {
    padding: 10px;
    font-size: 20px;
    font-weight: 700;
    color: black;
  }

  .content {
    .text {
      padding-bottom: 5px;
      border-bottom: 1px solid #bdbcbc;
      font-size: 16px;
      font-weight: 500;
      color: black;
    }
  
  .item-description {
    font-size: 14px;
    color: gray;
    margin-top: 5px;
  }

  }
}
</style>
