<template>
    <div class="search-form w-100 mx-auto">
      <form @submit="onSubmit($event)">
        <div class="input-group flex-nowrap">
          <input
            type="search"
            class="form-control"
            placeholder="Search...."
            aria-label="Search"
            aria-describedby="addon-wrapping"
            v-model="textSearch"
          />
          <div class="input-group-append">
            <button type="submit" class="btn-search">
              <img src="@/assets/icons/search.png" alt="Search" class="search-icon" />
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  const router = useRouter();
  const route = useRoute();
  const emit = defineEmits(["submitSearch"]);
  const textSearch = ref(route.query?.s || "");
  
  function onSubmit(e) {
    if (e) e.preventDefault();
    router.push({ query: { s: textSearch.value } });
    emit("submitSearch", textSearch.value);
  }
  </script>
  
  <style lang="scss" scoped>
  .search-form {
    max-width: 500px;
    .input-group {
      background-color: transparent;
      input {
        color: #fff;
        background: transparent;
        border: 1px solid #fff;
        border-right-width: 0px;
        border-radius: 4px 0 0 4px;
        padding: 8px 12px;
        &::placeholder {
          color: #fff;
        }
        &:focus {
          outline: none;
          box-shadow: none;
          border-color: #fff;
        }
      }
      .input-group-append {
        border: 1px solid #fff;
        display: flex;
        justify-items: center;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-left-width: 0px;
        .btn-search {
          background: transparent;
          border: none;
          padding: 0;
          .search-icon {
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
  </style>