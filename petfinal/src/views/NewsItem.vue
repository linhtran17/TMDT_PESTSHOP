<template>
  <div class="news-item" @click="onClick(props.news)">
    <img class="picture" :src="props.news.hinhanh" :alt="props.news.tieude || ''" />
    <div class="extension">
      <div class="title">
        <b>{{ props.news.tieude }}</b>
      </div>
      <div class="category">
        <b>Loại: </b> {{ props.news.theloai }}
      </div>
      <div class="date">
        <b>Ngày đăng: </b> {{ props.news.ngayDang }}
      </div>
      <button class="btn btn-primary">Xem Chi Tiết</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['news']);

function onClick(news) {
  router.push({ name: 'news-detail', params: { id: props.news?.id }, meta: { news: props.news } });
}
</script>

<style lang="scss" scoped>
.news-item {
  width: 230px;
  border-radius: 1rem;
  border: 1px solid #cdcdcd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;

  &:hover {
    border-width: 2px;
    cursor: pointer;
  }

  .picture {
    width: calc(100% - 2rem);
    margin: 0 auto;
    margin: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0px;
  }

  .extension {
    padding: 1rem;

    .title {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .category {
      b {
        font-weight: 600;
      }
    }

    .date {
      color: #888;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }
  }
}
</style>
