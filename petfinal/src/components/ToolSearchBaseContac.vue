<template>
  <div class="form-search">
    <form @submit="onSubmit">
      <div class="input-group">
        <input
          type="search"
          class="form-control"
          placeholder="Nhập tên để tìm kiếm..."
          aria-label="input-search"
          v-model="textSearch"
          aria-describedby="button-addon2"
        />
        <button
          class="btn btn-outline-secondary"
          type="submit"
          id="button-addon2"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["submitSearch"]);

const textSearch = ref(route.query?.s || "");

watch(
  () => route.query,
  (newQuery) => {
    textSearch.value = newQuery.s || "";
  }
);

function onSubmit(e) {
  if (e) e.preventDefault();
  router.push({ query: { ...route.query, s: textSearch.value, page: 1 } });
  emit("submitSearch", textSearch.value);
}
</script>

<style lang="scss" scoped>
.form-search {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: flex-end;
  margin-bottom: 1rem;

  .form-control {
    &:focus {
      box-shadow: none;
    }
  }
}
</style>
